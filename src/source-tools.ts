import {lstatSync, realpathSync, opendirSync} from 'node:fs';
import {basename, dirname, isAbsolute, join, resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {InspectionError, readBytes, problem} from './settings.js';

const MAX_FILE = 256 * 1024;
const MAX_ENTRIES = 1000;
const MAX_SEARCH_FILES = 100;
const MAX_SEARCH_BYTES = 8 * 1024 * 1024;
const excludedName = (name: string) => name.startsWith('.') || ['node_modules', 'vendor', 'dist'].includes(name)
  || /\.(pem|key|p12|pfx)$/i.test(name);
type Entry = {path: string; kind: 'file' | 'directory'};
type Omission = {path: string; reason: string};

/** Local read capability. Directory topology must remain stable during an operation. */
export class SourceTools {
  readonly root: string;
  readonly file: string | undefined;
  private identity: {dev: number; ino: number};
  constructor(source: string) {
    const selected = realpathSync(resolve(source));
    const stat = lstatSync(selected);
    if (!stat.isDirectory() && !stat.isFile()) throw new InspectionError('Select a directory or regular file');
    this.file = stat.isFile() ? basename(selected) : undefined;
    this.root = this.file ? dirname(selected) : selected;
    const rootStat = lstatSync(this.root); this.identity = {dev: rootStat.dev, ino: rootStat.ino};
  }
  get selected(): string { return this.file ? join(this.root, this.file) : this.root; }
  private checkRoot() {
    const stat = lstatSync(this.root);
    if (!stat.isDirectory() || realpathSync(this.root) !== this.root || stat.dev !== this.identity.dev || stat.ino !== this.identity.ino) throw new InspectionError('Source scope changed; start a new discovery session');
  }
  private path(path: string): string {
    this.checkRoot();
    if (typeof path !== 'string' || !path || isAbsolute(path) || /[\\\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u.test(path)) throw new InspectionError('Invalid source path');
    if (path === '.' && !this.file) return this.root;
    const parts = path.split('/');
    if (parts.some(p => !p || p === '.' || p === '..')) throw new InspectionError('Path escapes source scope');
    if (this.file && path !== this.file) throw new InspectionError('Path outside file-only scope');
    let current = this.root;
    for (const part of parts) {
      if (excludedName(part)) throw new InspectionError('Path excluded from source scope');
      current = join(current, part);
      if (lstatSync(current).isSymbolicLink()) throw new InspectionError('Symbolic links are outside source scope');
    }
    return current;
  }
  list(path = '.'): {entries: Entry[]; excluded: Omission[]; truncated: boolean} {
    this.checkRoot();
    if (this.file) {
      if (path !== '.') throw new InspectionError('Only . can be listed in file-only scope');
      return excludedName(this.file) ? {entries: [], excluded: [{path: this.file, reason: 'Excluded name'}], truncated: false}
        : {entries: [{path: this.file, kind: 'file'}], excluded: [], truncated: false};
    }
    const dir = opendirSync(this.path(path));
    const entries: Entry[] = [], excluded: Omission[] = [];
    let truncated = false;
    try {
      let count = 0;
      for (let entry = dir.readSync(); entry !== null; entry = dir.readSync()) {
        if (++count > MAX_ENTRIES) { truncated = true; break; }
        const child = path === '.' ? entry.name : `${path}/${entry.name}`;
        if (excludedName(entry.name) || entry.isSymbolicLink() || (!entry.isFile() && !entry.isDirectory())) {
          excluded.push({path: child, reason: 'Excluded name, symbolic link or special entry'});
        } else entries.push({path: child, kind: entry.isDirectory() ? 'directory' : 'file'});
      }
    } finally { dir.closeSync(); }
    entries.sort((a, b) => a.path.localeCompare(b.path));
    return {entries, excluded, truncated};
  }
  private bytes(path: string): {bytes: Buffer; text: string} {
    const bytes = readBytes(this.path(path), MAX_FILE);
    if (bytes.includes(0)) throw new InspectionError('Binary source is not supported text');
    try { return {bytes, text: new TextDecoder('utf-8', {fatal: true}).decode(bytes)}; }
    catch { throw new InspectionError('Source is not valid UTF-8 text'); }
  }
  read(path: string, startLine = 1, lineCount = 200) {
    if (!Number.isSafeInteger(startLine) || startLine < 1 || !Number.isSafeInteger(lineCount) || lineCount < 1 || lineCount > 200) throw new InspectionError('Invalid line range (1–200 lines per read)');
    const {bytes, text} = this.bytes(path);
    const lines = text.split('\n');
    const selected: string[] = [];
    let length = 0;
    for (let n = startLine - 1; n < Math.min(lines.length, startLine - 1 + lineCount); n++) {
      const content = `${n + 1}: ${lines[n]}`;
      if (length + content.length > 32 * 1024) break;
      selected.push(content); length += content.length + 1;
    }
    return {path, digest: `sha256:${createHash('sha256').update(bytes).digest('hex')}`,
      inspectedAt: new Date().toISOString(), startLine, endLine: startLine + selected.length - 1,
      totalLines: lines.length, text: selected.join('\n'), truncated: startLine > 1 || selected.length < lines.length};
  }
  search(query: string) {
    if (typeof query !== 'string' || !query || query.length > 200 || /[\r\n\0]/.test(query)) throw new InspectionError('Invalid literal search query (1–200 characters, one line)');
    const matches: {path: string; line: number; text: string; digest: string}[] = [];
    const excluded: Omission[] = [];
    const pending = ['.']; let files = 0, bytesRead = 0, entriesSeen = 0, truncated = false;
    outer: while (pending.length) {
      const directory = pending.shift()!;
      let listing;
      try { listing = this.list(directory); } catch (error) { excluded.push({path: directory, reason: problem(error)}); continue; }
      truncated ||= listing.truncated; excluded.push(...listing.excluded.slice(0, MAX_ENTRIES - excluded.length));
      entriesSeen += listing.excluded.length;
      if (entriesSeen > MAX_ENTRIES) { truncated = true; break; }
      for (const entry of listing.entries) {
        if (++entriesSeen > MAX_ENTRIES || files >= MAX_SEARCH_FILES || bytesRead >= MAX_SEARCH_BYTES || matches.length >= 100) { truncated = true; break outer; }
        if (entry.kind === 'directory') {
          if (entry.path.split('/').length < 32) pending.push(entry.path);
          else { truncated = true; excluded.push({path: entry.path, reason: 'Search depth limit'}); }
          continue;
        }
        files++;
        try {
          const {bytes, text} = this.bytes(entry.path); bytesRead += bytes.length;
          const digest = `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
          const lines = text.split('\n');
          for (let n = 0; n < lines.length; n++) if (lines[n]!.includes(query)) {
            matches.push({path: entry.path, line: n + 1, text: lines[n]!.slice(0, 1000), digest});
            if (matches.length >= 100) { truncated = true; break outer; }
          }
        } catch (error) { excluded.push({path: entry.path, reason: problem(error)}); }
      }
    }
    return {query, matches, excluded, truncated, filesInspected: files, inspectedAt: new Date().toISOString()};
  }
  call(tool: string, args: unknown): unknown {
    if (!args || typeof args !== 'object' || Array.isArray(args)) throw new InspectionError('Invalid tool arguments');
    const a = args as Record<string, unknown>;
    const keys = tool === 'source_list' ? ['path'] : tool === 'source_read' ? ['path', 'startLine', 'lineCount'] : tool === 'source_search' ? ['query'] : undefined;
    if (!keys) throw new InspectionError('Unknown source tool');
    if (Object.keys(a).some(k => !keys.includes(k))) throw new InspectionError('Invalid tool arguments');
    if (tool === 'source_search') return this.search(a.query as string);
    if (a.path !== undefined && typeof a.path !== 'string') throw new InspectionError('Invalid tool arguments');
    if (tool === 'source_list') return this.list(a.path as string | undefined);
    if (typeof a.path !== 'string') throw new InspectionError('Invalid tool arguments');
    return this.read(a.path, a.startLine as number | undefined, a.lineCount as number | undefined);
  }
}

export const sourceToolSpecs = [
  {name: 'source_list', description: 'List a directory in the authorized local source. Start with path ".". Returns explicit omissions and truncation.',
    inputSchema: {type: 'object', properties: {path: {type: 'string'}}, required: ['path'], additionalProperties: false}},
  {name: 'source_read', description: 'Read UTF-8 source evidence with line numbers and exact full-file SHA-256. Paths are relative to source; no shell or writes. Maximum 200 lines per call.',
    inputSchema: {type: 'object', properties: {path: {type: 'string'}, startLine: {type: 'integer'}, lineCount: {type: 'integer'}}, required: ['path'], additionalProperties: false}},
  {name: 'source_search', description: 'Bounded recursive literal case-sensitive search within authorized source text. Reports coverage omissions. Use source_read to inspect matching context.',
    inputSchema: {type: 'object', properties: {query: {type: 'string'}}, required: ['query'], additionalProperties: false}}
];
