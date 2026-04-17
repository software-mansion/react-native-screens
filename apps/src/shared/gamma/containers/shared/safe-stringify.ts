export function safeStringify(value: unknown, space?: number): string {
  const seen = new WeakSet();
  return JSON.stringify(
    value,
    (_key, val) => {
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) {
          return '[Circular]';
        }
        seen.add(val);
      }
      if (typeof val === 'function') {
        return '[Function]';
      }
      // React elements
      if (val != null && typeof val === 'object' && '$$typeof' in val) {
        return '[ReactElement]';
      }
      return val;
    },
    space,
  );
}
