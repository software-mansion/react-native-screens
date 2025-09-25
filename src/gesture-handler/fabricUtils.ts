'use strict';

/* eslint-disable */

type LocalGlobal = typeof global & Record<string, unknown>;

export function isFabric() {
  return !!(global as LocalGlobal).RN$Bridgeless;
}

export type HostInstance = {
  __internalInstanceHandle: Record<string, any>;
  __nativeTag: number;
  _viewConfig: Record<string, unknown>;
};

export function getShadowNodeWrapperAndTagFromRef(ref: HostInstance | null): {
  shadowNodeWrapper: any;
  tag: number;
} {
  if (!ref) {
    return {
      shadowNodeWrapper: null,
      tag: -1,
    }
  }
  return {
    shadowNodeWrapper: ref.__internalInstanceHandle.stateNode.node,
    tag: ref.__nativeTag,
  }
}
