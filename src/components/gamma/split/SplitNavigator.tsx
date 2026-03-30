import React from 'react';
import { StyleSheet } from 'react-native';
import SplitNavigatorNativeComponent from '../../../fabric/gamma/split/SplitNavigatorNativeComponent';
import type { SplitNavigatorProps } from './SplitNavigator.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 *
 * Represents a navigation column within a SplitView. Acts as a UINavigationController
 * for its column, managing the screen stack and header appearance.
 */
function SplitNavigator(props: SplitNavigatorProps) {
  return (
    <SplitNavigatorNativeComponent
      {...props}
      style={StyleSheet.absoluteFill}>
      {props.children}
    </SplitNavigatorNativeComponent>
  );
}

export default SplitNavigator;
