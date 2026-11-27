// Based on react-merge-refs: https://github.com/gregberge/react-merge-refs
import React from 'react';

function assignRef<T>(
  ref: React.Ref<T> | undefined,
  instance: T | null,
): ReturnType<React.RefCallback<T>> {
  if (typeof ref === 'function') {
    return ref(instance);
  } else if (ref != null) {
    ref.current = instance;
  }
}

export function mergeRefs<T>(
  refs: (React.Ref<T> | undefined)[],
): React.RefCallback<T> {
  return instance => {
    const cleanups = refs.map(ref => {
      const cleanup = assignRef(ref, instance);
      return typeof cleanup === 'function'
        ? cleanup
        : () => assignRef(ref, null);
    });

    return () => cleanups.forEach(cleanup => cleanup());
  };
}

export function useMergeRefs<T>(
  refs: (React.Ref<T> | undefined)[],
): React.RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(() => mergeRefs(refs), refs);
}
