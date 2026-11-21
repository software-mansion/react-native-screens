// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/src/SafeAreaView.tsx
'use client';

import React from 'react';
import { SafeAreaViewProps } from './SafeAreaView.types';
import SafeAreaViewNativeComponent, {
  NativeProps as SafeAreaViewNativeComponentProps,
} from '../../fabric/safe-area/SafeAreaViewNativeComponent';
import { StyleSheet } from 'react-native';

/**
 * Component that handles the safe area.
 *
 * @remarks
 * The insets are applied as padding, or as margin with
 * {@link SafeAreaViewProps.mode | mode}, on the edges selected with
 * {@link SafeAreaViewProps.edges | edges}. The view fills its parent
 * (`flex: 1`) unless its `style` says otherwise.
 *
 * @platform android, ios
 * @experimental
 */
export function SafeAreaView(props: SafeAreaViewProps) {
  return (
    <SafeAreaViewNativeComponent
      {...props}
      style={[styles.flex, props.style]}
      edges={getNativeEdgesProp(props.edges)}
    />
  );
}

function getNativeEdgesProp(
  edges: SafeAreaViewProps['edges'],
): SafeAreaViewNativeComponentProps['edges'] {
  return {
    top: false,
    bottom: false,
    left: false,
    right: false,
    ...edges,
  };
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
