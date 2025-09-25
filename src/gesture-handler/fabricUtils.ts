'use strict';

import { View } from "react-native";

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

export function getShadowNodeWrapperAndTagFromRef(ref: View | null): {
  shadowNodeWrapper: any;
  tag: number;
} {
  if (!ref) {
    return {
      shadowNodeWrapper: null,
      tag: -1,
    }
  }
  const internalRef = ref as unknown as HostInstance;
  return {
    shadowNodeWrapper: internalRef.__internalInstanceHandle.stateNode.node,
    tag: internalRef.__nativeTag,
  }
}
