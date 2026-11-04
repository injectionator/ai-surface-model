import {createHash} from 'node:crypto';
import type {Value} from './contracts.js';
export const MAX_BYTES = 2 * 1024 * 1024;
export const MAX_DEPTH = 64;
export function fail(path: string, message: string): never { throw new Error(`${path}: ${message}`); }
export function checkSize(text: string): void {
  if (Buffer.byteLength(text, 'utf8') > MAX_BYTES) fail('$', 'exceeds 2 MiB limit');
}
/** Reject before serialization: never invoke a getter or silently drop a value. */
export function portable(value: unknown, path = '$', ancestors = new Set<object>(), depth = 0): asserts value is Value {
  if (depth > MAX_DEPTH) fail(path, 'exceeds depth 64');
  if (value === null || typeof value === 'boolean') return;
  if (typeof value === 'string') {
    if (!value.isWellFormed()) fail(path, 'unpaired Unicode surrogate');
    return;
  }
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value) || Object.is(value, -0)) fail(path, 'requires a safe integer (no negative zero)');
    return;
  }
  if (typeof value !== 'object') fail(path, 'unsupported portable value');
  if (ancestors.has(value)) fail(path, 'object cycle; use identified graph edges');
  const array = Array.isArray(value);
  if (!array && Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) fail(path, 'requires a plain object');
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const keys = Reflect.ownKeys(value);
  if (array && (keys.length !== value.length + 1)) fail(path, 'sparse array or extra array properties');
  ancestors.add(value);
  for (const key of keys) {
    if (array && key === 'length') continue;
    if (typeof key !== 'string') fail(path, 'symbol key');
    portable(key, path);
    if (array && (!/^(0|[1-9][0-9]*)$/.test(key) || Number(key) >= value.length)) fail(path, 'extra array property');
    const descriptor = descriptors[key]!;
    if (!('value' in descriptor) || !descriptor.enumerable) fail(`${path}.${key}`, 'requires enumerable data property');
    portable(descriptor.value, `${path}.${key}`, ancestors, depth + 1);
  }
  ancestors.delete(value);
}
/** Object keys sorted by UTF-16 code units; arrays retain order; no whitespace. */
export function canonical(value: unknown): string {
  portable(value);
  const write = (v: Value): string => {
    if (Array.isArray(v)) return `[${v.map(write).join(',')}]`;
    if (v !== null && typeof v === 'object') return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${write(v[k]!)}`).join(',')}}`;
    return JSON.stringify(v);
  };
  const text = write(value); checkSize(text); return text;
}
export function digest(value: unknown): string {
  return `sha256:${createHash('sha256').update(canonical(value), 'utf8').digest('hex')}`;
}
