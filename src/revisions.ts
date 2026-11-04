import {validateArtefact} from './validate.js';
import {canonical, digest, fail} from './portable.js';
/** Validate a proposed successor; persistence and complete history belong to the host. */
export function verifySuccessor(previous: unknown, next: unknown): void {
  const before = validateArtefact(previous), after = validateArtefact(next);
  if (before.contract !== after.contract || before.id !== after.id) fail('$revision', 'contract/artefact identity changed');
  const parent = after.revision.parent;
  if (!parent || parent.id !== before.id || parent.revision !== before.revision.id || parent.digest !== digest(before) || after.revision.id === before.revision.id) fail('$revision', 'parent revision/digest mismatch or reused revision');
  if (before.contract === 'n8r.surface/0.1' && after.contract === 'n8r.surface/0.1') {
    for (const edge of after.relationships) {
      const old = before.relationships.find(x => x.id === edge.id);
      if (old && (old.from !== edge.from || old.to !== edge.to || canonical(old.type) !== canonical(edge.type))) fail(edge.id, 'retained relationship identity has different endpoints/type');
    }
  }
}
