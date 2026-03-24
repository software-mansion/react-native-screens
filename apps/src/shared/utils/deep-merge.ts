import React from 'react';

export function deepMerge<T extends object>(base: T, override: Partial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(override) as (keyof T)[]) {
    const baseVal = base[key];
    const overrideVal = override[key];
    if (isMergeableObject(overrideVal) && isMergeableObject(baseVal)) {
      result[key] = deepMerge(
        baseVal as object,
        overrideVal as object,
      ) as T[keyof T];
    } else {
      result[key] = overrideVal as T[keyof T];
    }
  }
  return result;
}

function isMergeableObject(val: unknown): val is object {
  return (
    val !== null &&
    typeof val === 'object' &&
    !Array.isArray(val) &&
    !React.isValidElement(val)
  );
}

