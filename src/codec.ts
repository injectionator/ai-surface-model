import {isAlias, isMap, isNode, isScalar, parseDocument, stringify, visit} from 'yaml';
import type {Artefact} from './contracts.js';
import {checkSize, fail, MAX_DEPTH, portable} from './portable.js';
import {validateArtefact} from './validate.js';
export type Encoding = 'json' | 'yaml';
function formatCheck(format: string): void { if (format !== 'json' && format !== 'yaml') fail('$format', 'unsupported encoding'); }
export function decode(text: string, format: Encoding): Artefact {
  formatCheck(format); checkSize(text);
  if (format === 'json') JSON.parse(text); // enforce JSON grammar before YAML's duplicate/number checks
  if (/^%/m.test(text)) fail('$', 'YAML directives unsupported');
  const doc = parseDocument(text, {version: '1.2', schema: 'core', uniqueKeys: true, strict: true});
  if (doc.errors.length || doc.warnings.length) fail('$', [...doc.errors, ...doc.warnings].map(x => x.message).join('; '));
  visit(doc, (_key, node, path) => {
    if (path.length > MAX_DEPTH * 2 + 2) fail('$', 'exceeds depth 64');
    if (isAlias(node) || (isNode(node) && (node.tag || ('anchor' in node && node.anchor)))) fail('$', 'YAML tags/anchors/aliases unsupported');
    if (isMap(node)) for (const pair of node.items) {
      if (!isScalar(pair.key) || typeof pair.key.value !== 'string') fail('$', 'mapping keys must be strings');
      if (format === 'yaml' && pair.key.value === '<<' && pair.key.type !== 'QUOTE_DOUBLE' && pair.key.type !== 'QUOTE_SINGLE') fail('$', 'unquoted YAML merge keys unsupported');
    }
    if (isScalar(node) && typeof node.value === 'number' && !/^-?(0|[1-9][0-9]*)$/.test(node.source ?? '')) fail('$', 'numbers require decimal integer notation');
  });
  const data: unknown = format === 'json' ? JSON.parse(text) : doc.toJS({maxAliasCount: 0});
  portable(data);
  return validateArtefact(data);
}
export function encode(value: unknown, format: Encoding): string {
  formatCheck(format); const a = validateArtefact(value);
  const text = format === 'json' ? JSON.stringify(a, null, 2) + '\n' : stringify(a, {version: '1.2', aliasDuplicateObjects: false, lineWidth: 0, defaultKeyType: 'QUOTE_DOUBLE'});
  checkSize(text); return text;
}
