import {readdirSync} from 'node:fs';
import {homedir} from 'node:os';
import {extname, join} from 'node:path';
import {decode} from './codec.js';
import {readResearchHtml} from './html.js';
import {line, problem, readLocal, InspectionError, loadSettings, type Settings} from './settings.js';

function artefacts(root: string): {lines: string[]; failed: boolean} {
  let entries;
  try { entries = readdirSync(root, {withFileTypes: true}); }
  catch (error) { return {lines: ['Local artefacts', `  ${line(root)} | Folder unavailable (${problem(error)})`], failed: (error as NodeJS.ErrnoException)?.code !== 'ENOENT'}; }
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

export function overview(): {text: string; failed: boolean; configured: boolean; settings?: Settings} {
  const home = homedir();
  const file = join(home, '.n8r/n8r-surface.json');
  const lines = ['Configuration', `  File: ${line(file)}`];
  let config: Settings | undefined;
  let failed = false;
  try {
    config = loadSettings(home);
    const text = config.original;
    if (text === undefined) lines.push('  Missing; using defaults (no file created)');
    lines.push(`  Settings version: 1${text === undefined ? ' (default)' : ''}`,
      `  Artefact folder: ${line(config.root)}${config.defaultRoot ? ' (default)' : ''}`,
      `  Vault folder: ${config.vault === undefined ? 'Not configured' : line(config.vault)}`,
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
  return {text: lines.join('\n') + '\n', failed, configured: config !== undefined, settings: config};
}
