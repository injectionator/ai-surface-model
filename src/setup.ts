import fs from 'node:fs';
import {dirname, join, relative, resolve, sep} from 'node:path';
import {randomUUID} from 'node:crypto';
import {InspectionError, loadSettings, localPath, type Settings} from './settings.js';

const children = ['research', 'artifacts', 'surfaces'];

/** Resolve existing ancestors as well as explicitly chosen root symlinks. */
function canonical(path: string): string {
  try { return fs.realpathSync(path); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    // Reject dangling symlinks rather than treating them as new directories.
    try { fs.lstatSync(path); throw new InspectionError('Dangling symlink'); }
    catch (entryError) { if ((entryError as NodeJS.ErrnoException).code !== 'ENOENT') throw entryError; }
    const parent = dirname(path);
    if (parent === path) throw error;
    return join(canonical(parent), path.slice(parent.length));
  }
}

export function chooseVault(value: string, home: string, cwd: string): string {
  return localPath(canonical(localPath(value, home, cwd)), home, cwd);
}

/** Read-only validation: missing folders need consent, occupied paths are errors. */
export function inspectVault(root: string): {root: string; missing: boolean} {
  root = canonical(root);
  let missing = false;
  for (const path of [root, ...children.map(child => join(root, child))]) {
    try {
      const stat = fs.lstatSync(path);
      if (stat.isSymbolicLink()) throw new InspectionError('Vault children cannot be symlinks');
      if (!stat.isDirectory()) throw new InspectionError('Vault path is not a directory');
      fs.accessSync(path, fs.constants.R_OK | fs.constants.X_OK);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      missing = true;
    }
  }
  return {root, missing};
}

function inside(path: string, source: string): boolean {
  const part = relative(source, canonical(path));
  return part === '' || (part !== '..' && !part.startsWith(`..${sep}`) && !part.startsWith(sep));
}

function unchanged(snapshot: Settings): void {
  const current = loadSettings(snapshot.home).original;
  if (snapshot.original === undefined ? current !== undefined : current === undefined || !snapshot.original.equals(current)) {
    throw new InspectionError('Settings changed; setup conflict. Restart and review the saved values.');
  }
}

/** Called only after explicit acceptance. See startup.md for the writer boundary. */
export function saveSetup(snapshot: Settings, selected: string, cwd: string): string {
  const vault = inspectVault(chooseVault(selected, snapshot.home, cwd)).root;
  const source = canonical(resolve(cwd));
  const file = snapshot.file;
  for (const path of [dirname(file), file, vault, ...children.map(child => join(vault, child))]) {
    if (inside(path, source)) throw new InspectionError('Setup would write inside the source; choose a separate vault or source directory.');
  }
  if (snapshot.vault !== undefined && canonical(snapshot.vault) !== vault) throw new InspectionError('Configured vault cannot be changed by setup');
  const legacy = canonical(snapshot.root);
  for (const child of children) {
    const path = join(vault, child);
    if (canonical(path) !== legacy && inside(path, legacy)) {
      throw new InspectionError('Vault folders would occupy the legacy artefact corpus; choose a separate vault.');
    }
  }
  // Keep unknown JSON member bytes, including numbers outside JS precision/range.
  // The validated original is an object containing version, so a comma is valid.
  let output = Buffer.alloc(0);
  if (snapshot.vault === undefined) {
    if (snapshot.original === undefined) {
      output = Buffer.from(JSON.stringify({version: 1, vaultRoot: vault}, null, 2) + '\n');
    } else {
      const end = snapshot.original.lastIndexOf(0x7d);
      output = Buffer.concat([snapshot.original.subarray(0, end),
        Buffer.from(`,\n  "vaultRoot": ${JSON.stringify(vault)}\n`), snapshot.original.subarray(end)]);
    }
  }
  if (output.length > 64 * 1024) throw new InspectionError('Updated settings exceeds 65536 bytes');
  fs.mkdirSync(dirname(file), {recursive: true});
  const lock = file + '.lock';
  let lockFd: number;
  try { lockFd = fs.openSync(lock, 'wx', 0o600); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') throw new InspectionError('Setup lock exists; another setup may be in progress. See startup documentation for stale-lock recovery.');
    throw error;
  }
  let temporary: string | undefined;
  try {
    unchanged(snapshot);
    fs.mkdirSync(vault, {recursive: true});
    for (const child of children) {
      const path = join(vault, child);
      try { fs.mkdirSync(path); }
      catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error; }
      const stat = fs.lstatSync(path);
      if (!stat.isDirectory() || stat.isSymbolicLink()) throw new InspectionError('Vault child is occupied or a symlink');
    }
    inspectVault(vault);
    unchanged(snapshot);
    if (snapshot.vault === undefined) {
      const candidate = file + '.' + randomUUID() + '.tmp';
      const fd = fs.openSync(candidate, 'wx', 0o600);
      temporary = candidate;
      try { fs.writeFileSync(fd, output); } finally { fs.closeSync(fd); }
      unchanged(snapshot);
      if (snapshot.original === undefined) fs.linkSync(temporary, file);
      else fs.renameSync(temporary, file);
    }
    return vault;
  } finally {
    try {
      if (temporary !== undefined) {
        try { fs.unlinkSync(temporary); }
        catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
      }
    } finally {
      fs.closeSync(lockFd);
      fs.unlinkSync(lock);
    }
  }
}
