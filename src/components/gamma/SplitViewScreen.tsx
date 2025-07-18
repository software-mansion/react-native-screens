import React from 'react';
import { StyleSheet } from 'react-native';
import type { ViewProps } from 'react-native';
import SplitViewScreenNativeComponent from '../../fabric/gamma/SplitViewScreenNativeComponent';
import type { NativeProps } from '../../fabric/gamma/SplitViewScreenNativeComponent';

export type SplitViewScreenNativeProps = NativeProps & {
  // Overrides
};

type SplitViewScreenProps = {
  children?: ViewProps['children'];
} & SplitViewScreenNativeProps;

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function SplitViewScreen({ children }: SplitViewScreenProps) {
  return (
    <SplitViewScreenNativeComponent style={StyleSheet.absoluteFill}>
      {children}
    </SplitViewScreenNativeComponent>
  );
}

export default SplitViewScreen;
