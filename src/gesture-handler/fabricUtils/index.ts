'use strict';

import { View } from 'react-native';
import { HostInstance, findHostInstance } from './findHostInstance';
export { isFabric } from './arch-check';

/* eslint-disable */

export type ShadowNodeWrapper = {
  __hostObjectShadowNodeWrapper: never;
};

let getInternalInstanceHandleFromPublicInstance: (ref: unknown) => {
  stateNode: { node: unknown };
};

// Taken and modifies from reanimated
export function getShadowNodeWrapperAndTagFromRef(
  ref: View | null,
  hostInstance?: HostInstance,
): {
  shadowNodeWrapper: ShadowNodeWrapper;
  tag: number;
} {
  if (getInternalInstanceHandleFromPublicInstance === undefined) {
    try {
      getInternalInstanceHandleFromPublicInstance =
        require('react-native/Libraries/ReactNative/ReactFabricPublicInstance/ReactFabricPublicInstance')
          .getInternalInstanceHandleFromPublicInstance ??
        ((_ref: any) => _ref._internalInstanceHandle);
    } catch (e) {
      getInternalInstanceHandleFromPublicInstance = (_ref: any) =>
        _ref._internalInstanceHandle;
    }
  }

  // taken from https://github.com/facebook/react-native/commit/803bb16531697233686efd475f004c1643e03617#diff-d8172256c6d63b5d32db10e54d7b10f37a26b337d5280d89f5bfd7bcea778292R196
  // @ts-ignore some weird stuff on RN 0.74 - see examples with scrollView
  const scrollViewRef = ref?.getScrollResponder?.()?.getNativeScrollRef?.();
  // @ts-ignore some weird stuff on RN 0.74  - see examples with scrollView
  const otherScrollViewRef = ref?.getNativeScrollRef?.();
  // @ts-ignore some weird stuff on RN 0.74 - see setNativeProps example
  const textInputRef = ref?.__internalInstanceHandle?.stateNode?.node;

  let resolvedRef;
  if (scrollViewRef) {
    resolvedRef = {
      shadowNodeWrapper: scrollViewRef.__internalInstanceHandle.stateNode.node,
      tag: scrollViewRef._nativeTag,
    };
  } else if (otherScrollViewRef) {
    resolvedRef = {
      shadowNodeWrapper:
        otherScrollViewRef.__internalInstanceHandle.stateNode.node,
      tag: otherScrollViewRef.__nativeTag,
    };
  } else if (textInputRef) {
    resolvedRef = {
      shadowNodeWrapper: textInputRef,
      tag: (ref as any)?.__nativeTag,
    };
  } else {
    const instance = hostInstance ?? findHostInstance(ref as any);
    resolvedRef = {
      shadowNodeWrapper:
        getInternalInstanceHandleFromPublicInstance(instance).stateNode.node,
      tag: (instance as any)?._nativeTag ?? (instance as any)?.__nativeTag,
    };
    //const hostInstance = findHostInstance_DEPRECATED(ref);
    //resolvedRef = {
    //  shadowNodeWrapper:
    //    getInternalInstanceHandleFromPublicInstance(hostInstance).stateNode
    //      .node,
    //  tag: (hostInstance as any)?._nativeTag,
    //};
  }

  return resolvedRef;
}
