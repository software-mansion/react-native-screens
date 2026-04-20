import { isValidElement } from 'react';

export function safeStringify(value: unknown, space?: number): string {
  const seen = new WeakSet();
  return JSON.stringify(
    value,
    (_key, val) => {
      if (typeof val === 'object' && val !== null) {
        // Note: this also flags shared (non-circular) refs as [Circular],
        // e.g. `{ x: a, y: a }` but it's good enough for debug logs.
        if (seen.has(val)) {
          return '[Circular]';
        }
        seen.add(val);
      }
      if (typeof val === 'function') {
        return '[Function]';
      }
      if (isValidElement(val)) {
        return '[ReactElement]';
      }
      return val;
    },
    space,
  );
}
