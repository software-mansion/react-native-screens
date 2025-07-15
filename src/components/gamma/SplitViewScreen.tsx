import React from 'react';
import { StyleSheet } from 'react-native';
import type { ViewProps } from 'react-native';
import SplitViewScreenNativeComponent from '../../fabric/gamma/SplitViewScreenNativeComponent';
import type {
  NativeProps,
  SplitViewScreenColumnType,
} from '../../fabric/gamma/SplitViewScreenNativeComponent';

export type SplitViewScreenNativeProps = NativeProps & {
  // Config

  columnType?: SplitViewScreenColumnType;
};

type SplitViewScreenProps = {
  children?: ViewProps['children'];
} & SplitViewScreenNativeProps;

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function SplitViewScreen({ children, columnType }: SplitViewScreenProps) {
  return (
    <SplitViewScreenNativeComponent
      columnType={columnType}
      style={StyleSheet.absoluteFill}>
      {children}
    </SplitViewScreenNativeComponent>
  );
}

export default SplitViewScreen;
