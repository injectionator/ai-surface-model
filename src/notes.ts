import fs from 'node:fs';
import {basename, dirname, join, relative, resolve, sep} from 'node:path';
import {createHash, randomUUID} from 'node:crypto';
import {InspectionError, readBytes} from './settings.js';

const LIMIT = 256 * 1024;
const MARKER = '\n<!-- n8r-note-v1 -->\n';
const namePattern = /^([a-z0-9]+(?:-[a-z0-9]+)*)-(\d{3,})\.md$/;
export type Evidence = {path: string; digest: string; inspectedAt: string; startLine: number; endLine: number};
export type NoteContext = {researcher: {version: string; digest: string}; model: string; evidence: Evidence[]};
type Metadata = NoteContext & {version: 1; createdAt: string; source: {name: string; kind: 'file' | 'directory'}; predecessor?: {file: string; digest: string}};
export type Note = {path: string; text: string; digest: string; metadata: Metadata; modifiedAt: string};
const digest = (bytes: Buffer) => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const slug = (source: string) => basename(source).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'source';
const inside = (path: string, root: string) => { const p = relative(root, path); return !p || (p !== '..' && !p.startsWith(`..${sep}`) && !p.startsWith(sep)); };
function folder(vault: string, source: string) { return join(fs.realpathSync(vault), 'research', slug(source)); }

function validateMetadata(value: any): asserts value is Metadata {
  if (!value || value.version !== 1 || !value.source || !['file','directory'].includes(value.source.kind)
    || typeof value.source.name !== 'string' || typeof value.createdAt !== 'string'
    || typeof value.model !== 'string' || typeof value.researcher?.version !== 'string' || typeof value.researcher?.digest !== 'string'
    || !Array.isArray(value.evidence) || value.evidence.length > 1000
    || value.evidence.some((e: any) => !e || typeof e.path !== 'string' || !/^sha256:[a-f0-9]{64}$/.test(e.digest)
      || typeof e.inspectedAt !== 'string' || !Number.isSafeInteger(e.startLine) || !Number.isSafeInteger(e.endLine))
    || (value.predecessor !== undefined && (!namePattern.test(value.predecessor.file) || !/^sha256:[a-f0-9]{64}$/.test(value.predecessor.digest)))) {
    throw new InspectionError('Invalid working-note metadata; preserve the host footer when editing');
  }
}

/** Explicitly selected notes may live outside the vault; their folder becomes the save scope. */
export function readNote(path: string): Note {
  path = resolve(path);
  if (!namePattern.test(basename(path))) throw new InspectionError('Select a numbered working note such as research-001.md');
  if (fs.lstatSync(path).isSymbolicLink()) throw new InspectionError('Note cannot be a symbolic link');
  path = join(fs.realpathSync(dirname(path)), basename(path));
  const bytes = readBytes(path, LIMIT);
  let text: string;
  try { text = new TextDecoder('utf-8', {fatal:true}).decode(bytes); }
  catch { throw new InspectionError('Note is not UTF-8 text'); }
  if (text.includes('\0')) throw new InspectionError('Note contains binary data');
  const marker = text.lastIndexOf(MARKER);
  const footer = marker < 0 ? undefined : /^```json\n([\s\S]*?)\n```(?:\n|$)/.exec(text.slice(marker + MARKER.length));
  if (!footer) throw new InspectionError('Expected an n8r-surface working note with its host metadata footer');
  let metadata: unknown;
  try { metadata = JSON.parse(footer[1]!); } catch { throw new InspectionError('Invalid working-note metadata JSON'); }
  validateMetadata(metadata);
  return {path, text, digest:digest(bytes), metadata, modifiedAt:fs.statSync(path).mtime.toISOString()};
}

/** Local folder metadata only; never infer identity from the latest filename. */
export function latestNote(vault: string, source: string): Note | undefined {
  const dir = folder(vault, source);
  const scope = new Notes(vault, source); // validate ancestry, including a replaced research folder
  scope.next();
  let entries;
  try { entries = fs.readdirSync(dir, {withFileTypes:true}); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined; throw error; }
  if (entries.length > 10000) throw new InspectionError('Too many notes; select an explicit filename');
  const candidates = entries.filter(e => e.isFile() && namePattern.test(e.name))
    .map(e => ({path:join(dir,e.name), time:fs.statSync(join(dir,e.name)).mtimeMs}))
    .sort((a,b)=>b.time-a.time || a.path.localeCompare(b.path));
  return candidates.length ? readNote(candidates[0]!.path) : undefined;
}

/** Synchronous bounded host writer. Directory topology must remain stable during each operation. */
export class Notes {
  readonly directory: string;
  predecessor: Note | undefined;
  private topic: string;
  private stamps = new Map<string, {dev:number; ino:number}>();
  private source: string;
  private sourceKind: 'file' | 'directory';
  constructor(vault: string, source: string, predecessor?: Note) {
    this.source = fs.realpathSync(source);
    this.sourceKind = fs.statSync(this.source).isFile() ? 'file' : 'directory';
    this.directory = predecessor ? dirname(predecessor.path) : folder(vault, this.source);
    if (this.sourceKind === 'directory' && inside(this.directory, this.source)) throw new InspectionError('Notes cannot be saved inside the selected source');
    this.predecessor = predecessor;
    this.topic = predecessor ? namePattern.exec(basename(predecessor.path))![1]! : 'research';
    this.check();
  }
  private check() {
    const paths: string[] = [];
    for (let p = this.directory; ; p = dirname(p)) { paths.unshift(p); if (dirname(p) === p) break; }
    for (const path of paths) {
      let stat;
      try { stat = fs.lstatSync(path); }
      catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT' && !this.stamps.has(path)) continue;
        throw new InspectionError('Note directory changed; reopen before saving');
      }
      if (stat.isSymbolicLink() || !stat.isDirectory()) throw new InspectionError('Note directory is occupied or a symbolic link');
      const old = this.stamps.get(path);
      if (old && (old.dev !== stat.dev || old.ino !== stat.ino)) throw new InspectionError('Note directory changed; reopen before saving');
      this.stamps.set(path,{dev:stat.dev,ino:stat.ino});
    }
  }
  next(): string {
    this.check();
    let names: string[];
    try { names = fs.readdirSync(this.directory); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') names = []; else throw error; }
    if (names.length > 10000) throw new InspectionError('Too many notes in this folder');
    let n = 0;
    for (const name of names) { const match = namePattern.exec(name); if (match?.[1] === this.topic) n = Math.max(n,Number(match[2])); }
    if (!Number.isSafeInteger(n + 1)) throw new InspectionError('Note numbering limit reached');
    return join(this.directory,`${this.topic}-${String(n+1).padStart(3,'0')}.md`);
  }
  save(path: string, markdown: string, context: NoteContext): Note {
    this.check();
    if (dirname(path) !== this.directory || namePattern.exec(basename(path))?.[1] !== this.topic || path === this.source) throw new InspectionError('Output outside authorized note scope');
    if (typeof markdown !== 'string' || !markdown.trim() || Buffer.byteLength(markdown) > 192 * 1024 || markdown.includes(MARKER) || markdown.includes('\0')) throw new InspectionError('Invalid or oversized Markdown draft');
    const unchanged = () => {
      if (this.predecessor && !readBytes(this.predecessor.path,LIMIT).equals(Buffer.from(this.predecessor.text))) throw new InspectionError('Predecessor changed; reopen the edited note before saving');
    };
    unchanged();
    const metadata: Metadata = {...context, version:1, createdAt:new Date().toISOString(),
      source:{name:basename(this.source),kind:this.sourceKind},
      ...(this.predecessor ? {predecessor:{file:basename(this.predecessor.path),digest:this.predecessor.digest}} : {})};
    validateMetadata(metadata);
    const predecessor = metadata.predecessor ? `Predecessor: [${metadata.predecessor.file}](${metadata.predecessor.file}) (${metadata.predecessor.digest}).\n\n` : '';
    const bytes = Buffer.from(predecessor + markdown.trim() + '\n\n## Host provenance\n\nExperimental working-note metadata; not an AI Surface schema. Source paths are\nrelative to the explicitly selected source; hashes identify bytes, not truth.\n' + MARKER + '```json\n' + JSON.stringify(metadata,null,2) + '\n```\n');
    if (bytes.length > LIMIT) throw new InspectionError('Saved note exceeds 256 KiB; narrow the research scope');
    fs.mkdirSync(this.directory,{recursive:true,mode:0o700}); this.check();
    const temporary = join(this.directory,`.note-${randomUUID()}.tmp`);
    const fd = fs.openSync(temporary,'wx',0o600);
    try {
      fs.writeFileSync(fd,bytes); fs.fsyncSync(fd);
      this.check(); unchanged();
      // Publish a complete file without replacing any existing file or symlink.
      fs.linkSync(temporary,path);
      const saved = readNote(path);
      if (saved.digest !== digest(bytes)) throw new InspectionError('Saved note readback differs; inspect the output before retrying');
      this.predecessor = saved;
      return saved;
    } finally { fs.closeSync(fd); fs.unlinkSync(temporary); }
  }
}
