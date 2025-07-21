import React from 'react';
import { StyleSheet } from 'react-native';
import type { ViewProps } from 'react-native';
import SplitViewScreenNativeComponent from '../../fabric/gamma/SplitViewScreenNativeComponent';

type SplitViewScreenProps = {
  children?: ViewProps['children'];

  // Events
  onWillAppear?: () => void;
  onDidAppear?: () => void;
  onWillDisappear?: () => void;
  onDidDisappear?: () => void;
};

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function Column(props: SplitViewScreenProps) {
  return (
    <SplitViewScreenNativeComponent
      columnType="column"
      {...props}
      style={StyleSheet.absoluteFill}>
      {props.children}
    </SplitViewScreenNativeComponent>
  );
}

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function Inspector(props: SplitViewScreenProps) {
  return (
    <SplitViewScreenNativeComponent
      columnType="inspector"
      {...props}
      style={StyleSheet.absoluteFill}>
      {props.children}
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
