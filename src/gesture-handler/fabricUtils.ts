interface HostInstance {
  _internalInstanceHandle: {
    stateNode: {
      node: Record<string, unknown>;
    };
  };
  _nativeTag: number;
}

type localGlobal = typeof global & Record<string, unknown>;

export function isFabric() {
  return !!(global as localGlobal)._IS_FABRIC;
}

let findHostInstance_DEPRECATED: (ref: React.Component) => HostInstance | null = () => { return null; };
if (isFabric()) {
  try {
    findHostInstance_DEPRECATED =
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('react-native/Libraries/Renderer/shims/ReactFabric').findHostInstance_DEPRECATED;
  } catch (e) {
    throw new Error(
      '[Reanimated] Cannot import `findHostInstance_DEPRECATED`.'
    );
  }
}

export function getShadowNodeWrapperAndTagFromRef(
  ref: React.Component
) {
  const hostInstance = findHostInstance_DEPRECATED(ref);
  return {
    shadowNodeWrapper: hostInstance?._internalInstanceHandle.stateNode.node,
    tag: hostInstance?._nativeTag,
  };
}
