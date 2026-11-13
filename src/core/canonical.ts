/**
 * Canonical JSON = RFC 8785 (JCS) + project restrictions (docs/10 §3.1).
 * - keys sorted by UTF-16 code units, no whitespace, ES number/string serialisation
 * - throws on NaN/±Infinity/-0, undefined, functions, symbols, bigint, sparse arrays, non-plain objects
 * - strings must already be NFC (rejected, never normalised)
 * - integersOnly: every number must be a safe integer (simulation state, logs, snapshots)
 */
export interface CanonicalOptions {
  integersOnly?: boolean;
}

export class CanonicalError extends Error {}

export function canonicalize(value: unknown, opts: CanonicalOptions = {}): string {
  const out: string[] = [];
  write(value, opts, out, '$');
  return out.join('');
}

function write(v: unknown, opts: CanonicalOptions, out: string[], path: string): void {
  if (v === null) {
    out.push('null');
    return;
  }
  switch (typeof v) {
    case 'boolean':
      out.push(v ? 'true' : 'false');
      return;
    case 'number':
      if (!Number.isFinite(v)) throw new CanonicalError(`${path}: non-finite number`);
      if (Object.is(v, -0)) throw new CanonicalError(`${path}: -0 is not allowed`);
      if (opts.integersOnly && !Number.isSafeInteger(v)) throw new CanonicalError(`${path}: non-integer ${v} in integer-only data`);
      out.push(JSON.stringify(v));
      return;
    case 'string':
      if (v !== v.normalize('NFC')) throw new CanonicalError(`${path}: string is not Unicode NFC`);
      out.push(JSON.stringify(v));
      return;
    case 'object': {
      if (Array.isArray(v)) {
        out.push('[');
        for (let i = 0; i < v.length; i++) {
          if (!(i in v)) throw new CanonicalError(`${path}[${i}]: sparse array`);
          if (i) out.push(',');
          write(v[i], opts, out, `${path}[${i}]`);
        }
        out.push(']');
        return;
      }
      const proto = Object.getPrototypeOf(v);
      if (proto !== Object.prototype && proto !== null) throw new CanonicalError(`${path}: not a plain object`);
      const keys = Object.keys(v as object).sort(); // default sort = UTF-16 code unit order
      out.push('{');
      let first = true;
      for (const k of keys) {
        const child = (v as Record<string, unknown>)[k];
        if (child === undefined) throw new CanonicalError(`${path}.${k}: undefined`);
        if (k !== k.normalize('NFC')) throw new CanonicalError(`${path}: key ${k} is not NFC`);
        if (!first) out.push(',');
        first = false;
        out.push(JSON.stringify(k), ':');
        write(child, opts, out, `${path}.${k}`);
      }
      out.push('}');
      return;
    }
    default:
      throw new CanonicalError(`${path}: unsupported type ${typeof v}`);
  }
}
