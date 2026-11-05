// Read-only source version validation. Build metadata is deliberately excluded
// from release versions so npm identity and Git tag identity stay unambiguous.
import {readFileSync, realpathSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {fileURLToPath} from 'node:url';

export function checkVersion(root = resolve(import.meta.dirname, '..')) {
  const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
  const version = manifest.version;
  const number = '(0|[1-9][0-9]*)';
  const identifier = '(?:0|[1-9][0-9]*|[0-9]*[a-zA-Z-][0-9a-zA-Z-]*)';
  if (typeof version !== 'string' || !new RegExp(`^${number}\\.${number}\\.${number}(?:-${identifier}(?:\\.${identifier})*)?$`).test(version)) {
    throw new Error('Version must be canonical SemVer without build metadata');
  }
  if (manifest.name !== 'n8r-surface' || lock.name !== manifest.name || lock.packages?.['']?.name !== manifest.name ||
      lock.version !== version || lock.packages[''].version !== version) {
    throw new Error('Source manifest and lockfile name/version must match');
  }
  return version;
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length > 3) throw new Error('Usage: node scripts/check-version.mjs [SOURCE_DIRECTORY]');
  console.log(`Version consistent: ${checkVersion(process.argv[2])}`);
}
