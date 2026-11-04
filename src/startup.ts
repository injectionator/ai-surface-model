import {constants, openSync, closeSync, fstatSync, readSync, readdirSync} from 'node:fs';
import {homedir} from 'node:os';
import {dirname, extname, isAbsolute, join, resolve} from 'node:path';
import {decode} from './codec.js';
import {readResearchHtml} from './html.js';

/** Escape terminal controls and line/bidi separators in untrusted labels. */
function line(value: string): string {
  return value.replace(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, c => `\\u${c.codePointAt(0)!.toString(16).padStart(4, '0')}`);
}

class InspectionError extends Error {}
function problem(error: unknown): string {
  if (error instanceof InspectionError) return error.message;
  const code = (error as NodeJS.ErrnoException)?.code;
  return typeof code === 'string' && /^[A-Z0-9_]+$/.test(code) ? code : 'Read failed';
}

/** Do not block on special files, follow entry symlinks or read unbounded data. */
function readLocal(path: string, limit: number): string {
  const fd = openSync(path, constants.O_RDONLY | constants.O_NONBLOCK | constants.O_NOFOLLOW);
  try {
    const stat = fstatSync(fd);
    if (!stat.isFile()) throw new InspectionError('Not a regular file');
    if (stat.size > limit) throw new InspectionError(`File exceeds ${limit} bytes`);
    const buffer = Buffer.alloc(limit + 1);
    let bytes = 0;
    while (bytes < buffer.length) {
      const count = readSync(fd, buffer, bytes, buffer.length - bytes, null);
      if (!count) break;
      bytes += count;
    }
    if (bytes > limit) throw new InspectionError(`File exceeds ${limit} bytes`);
    return buffer.subarray(0, bytes).toString('utf8');
  } finally {
    closeSync(fd);
  }
}

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

interface Settings {
  root: string;
  format: 'json' | 'yaml';
  defaultRoot: boolean;
  defaultFormat: boolean;
  runner: boolean;
  lab: boolean;
}
function settings(text: string | undefined, home: string, file: string): Settings {
  let data: unknown = {version: 1};
  if (text !== undefined) {
    try { data = JSON.parse(text); }
    catch { throw new InspectionError('Invalid JSON; repair the existing file'); }
  }
  if (!object(data) || data.version !== 1) throw new InspectionError('Expected settings object with version 1');
  const path = data.artefactRoot === undefined ? '~/n8r/artefacts' : data.artefactRoot;
  if (typeof path !== 'string' || path.trim() === '' || /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u.test(path) || /^[a-z][a-z0-9+.-]*:\/\//i.test(path) || (path.startsWith('~') && !path.startsWith('~/'))) {
    throw new InspectionError('artefactRoot must be a local path, optionally starting with ~/');
  }
  const format = data.surfaceFormat === undefined ? 'json' : data.surfaceFormat;
  if (format !== 'json' && format !== 'yaml') throw new InspectionError('surfaceFormat must be json or yaml');
  for (const key of ['runner', 'lab']) {
    if (data[key] !== undefined && data[key] !== null && !object(data[key])) throw new InspectionError(`${key} must be an object or null`);
  }
  return {
    root: path.startsWith('~/') ? resolve(home, path.slice(2)) : isAbsolute(path) ? resolve(path) : resolve(dirname(file), path),
    format, defaultRoot: data.artefactRoot === undefined, defaultFormat: data.surfaceFormat === undefined,
    runner: object(data.runner), lab: object(data.lab)
  };
}

function artefacts(root: string): {lines: string[]; failed: boolean} {
  let entries;
  try { entries = readdirSync(root, {withFileTypes: true}); }
  catch (error) { return {lines: ['Local artefacts', `  ${line(root)} | Folder unavailable (${problem(error)})`], failed: true}; }
  entries.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
  const lines = [`Local artefacts (${entries.length})`];
  let failed = false;
  if (!entries.length) lines.push('  Folder is empty');
  for (const entry of entries) {
    const path = join(root, entry.name);
    try {
      if (entry.isSymbolicLink()) throw new InspectionError('Symlink not followed');
      if (!entry.isFile()) throw new InspectionError('Not a regular file');
      const extension = extname(entry.name).toLowerCase();
      if (!['.json', '.yaml', '.yml', '.html'].includes(extension)) throw new InspectionError('Unsupported file type');
      const text = readLocal(path, 2 * 1024 * 1024);
      let value;
      try { value = extension === '.html' ? readResearchHtml(text) : decode(text, extension === '.json' ? 'json' : 'yaml'); }
      catch { throw new InspectionError('Invalid or unsupported artefact; content not displayed'); }
      const type = value.contract === 'n8r.surface/0.1' ? 'Surface definition' : 'Research record';
      lines.push(`  ${line(value.title)} | ${type} | ${line(path)}`);
    } catch (error) {
      failed = true;
      lines.push(`  ${line(path)} | ${problem(error)}`);
    }
  }
  return {lines, failed};
}

export function overview(): {text: string; failed: boolean; configured: boolean} {
  const home = homedir();
  const file = join(home, '.n8r/n8r-surface.json');
  const lines = ['Configuration', `  File: ${line(file)}`];
  let config: Settings | undefined;
  let failed = false;
  try {
    let text: string | undefined;
    try { text = readLocal(file, 64 * 1024); }
    catch (error) {
      if ((error as NodeJS.ErrnoException)?.code !== 'ENOENT') throw error;
      lines.push('  Missing; using defaults (no file created)');
    }
    config = settings(text, home, file);
    lines.push(`  Settings version: 1${text === undefined ? ' (default)' : ''}`,
      `  Artefact folder: ${line(config.root)}${config.defaultRoot ? ' (default)' : ''}`,
      `  Surface output: ${config.format.toUpperCase()}${config.defaultFormat ? ' (default)' : ''}`,
      `  AI runner: ${config.runner ? 'Configured (unverified; details withheld)' : 'Not configured'}`,
      `  Lab connection: ${config.lab ? 'Configured (unverified; details withheld)' : 'Not configured'}`);
  } catch (error) {
    failed = true;
    lines.push(`  Configuration unavailable: ${problem(error)}`);
  }
  lines.push('', 'Processes', `  n8r-surface overview: running (PID ${process.pid}); observed ${new Date().toISOString()}`,
    '  Runner/Lab processes: Status unknown (no live status source)', '');
  if (config) {
    const listed = artefacts(config.root);
    lines.push(...listed.lines);
    failed ||= listed.failed;
  } else lines.push('Local artefacts', '  Not inspected: configuration unavailable');
  return {text: lines.join('\n') + '\n', failed, configured: config !== undefined};
}
