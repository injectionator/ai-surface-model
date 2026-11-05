import {constants, openSync, closeSync, fstatSync, readSync, lstatSync} from 'node:fs';
import {homedir} from 'node:os';
import {dirname, join, resolve} from 'node:path';

/** Escape terminal controls and line/bidi separators in untrusted labels. */
export function line(value: string): string {
  return value.replace(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, c => `\\u${c.codePointAt(0)!.toString(16).padStart(4, '0')}`);
}

export class InspectionError extends Error {}
export function problem(error: unknown): string {
  if (error instanceof InspectionError) return error.message;
  const code = (error as NodeJS.ErrnoException)?.code;
  return typeof code === 'string' && /^[A-Z0-9_]+$/.test(code) ? code : 'Read failed';
}

/** Do not block on special files, follow entry symlinks or read unbounded data. */
export function readBytes(path: string, limit: number): Buffer {
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
    return buffer.subarray(0, bytes);
  } finally {
    closeSync(fd);
  }
}

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export interface Settings {
  home: string;
  file: string;
  original: Buffer | undefined;
  data: Record<string, unknown>;
  vault: string | undefined;
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
  const path = localPath(data.artefactRoot === undefined ? '~/n8r/artefacts' : data.artefactRoot, home, dirname(file));
  const vault = data.vaultRoot === undefined ? undefined : localPath(data.vaultRoot, home, dirname(file));
  const format = data.surfaceFormat === undefined ? 'json' : data.surfaceFormat;
  if (format !== 'json' && format !== 'yaml') throw new InspectionError('surfaceFormat must be json or yaml');
  for (const key of ['runner', 'lab']) {
    if (data[key] !== undefined && data[key] !== null && !object(data[key])) throw new InspectionError(`${key} must be an object or null`);
  }
  return {
    home, file, original: undefined, data, vault, root: path,
    format, defaultRoot: data.artefactRoot === undefined, defaultFormat: data.surfaceFormat === undefined,
    runner: object(data.runner), lab: object(data.lab)
  };
}

export function localPath(value: unknown, home: string, base: string): string {
  if (typeof value !== 'string' || !value.trim() || /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/u.test(value) || /^[a-z][a-z0-9+.-]*:/i.test(value) || (value.startsWith('~') && !value.startsWith('~/'))) {
    throw new InspectionError('Expected a local path, optionally starting with ~/');
  }
  return value.startsWith('~/') ? resolve(home, value.slice(2)) : resolve(base, value);
}

export function readLocal(path: string, limit: number): string {
  return readBytes(path, limit).toString('utf8');
}

export function loadSettings(home = homedir()): Settings {
  const file = join(home, '.n8r/n8r-surface.json');
  let original: Buffer | undefined;
  try { original = readBytes(file, 64 * 1024); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    // A dangling symlink is not an absent settings file.
    try { lstatSync(file); throw new InspectionError('Settings is not a regular file'); }
    catch (entryError) { if ((entryError as NodeJS.ErrnoException).code !== 'ENOENT') throw entryError; }
  }
  return {...settings(original?.toString('utf8'), home, file), original};
}
