import React from 'react';
import { StyleSheet } from 'react-native';
import type { ViewProps } from 'react-native';
import SplitViewScreenNativeComponent from '../../fabric/gamma/SplitViewScreenNativeComponent';

type SplitViewScreenProps = {
  children?: ViewProps['children'];
};

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function Column({ children }: SplitViewScreenProps) {
  return (
    <SplitViewScreenNativeComponent
      columnType="column"
      style={StyleSheet.absoluteFill}>
      {children}
    </SplitViewScreenNativeComponent>
  );
}

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function Inspector({ children }: SplitViewScreenProps) {
  return (
    <SplitViewScreenNativeComponent
      columnType="inspector"
      style={StyleSheet.absoluteFill}>
      {children}
    </SplitViewScreenNativeComponent>
  );
}

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
// TODO: refactor to drop `Screen` suffix as the API name is really long at the moment
const SplitViewScreen = {
  Column,
  Inspector,
};

export default SplitViewScreen;
