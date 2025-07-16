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
function Column({
  children,
  onDidAppear,
  onDidDisappear,
  onWillAppear,
  onWillDisappear,
}: SplitViewScreenProps) {
  return (
    <SplitViewScreenNativeComponent
      columnType="column"
      onDidAppear={onDidAppear}
      onDidDisappear={onDidDisappear}
      onWillAppear={onWillAppear}
      onWillDisappear={onWillDisappear}
      style={StyleSheet.absoluteFill}>
      {children}
    </SplitViewScreenNativeComponent>
  );
}

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function Inspector({
  children,
  onDidAppear,
  onDidDisappear,
  onWillAppear,
  onWillDisappear,
}: SplitViewScreenProps) {
  return (
    <SplitViewScreenNativeComponent
      columnType="inspector"
      onDidAppear={onDidAppear}
      onDidDisappear={onDidDisappear}
      onWillAppear={onWillAppear}
      onWillDisappear={onWillDisappear}
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
