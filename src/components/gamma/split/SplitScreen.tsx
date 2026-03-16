import React from 'react';
import { StyleSheet } from 'react-native';
import SplitScreenNativeComponent from '../../../fabric/gamma/split/SplitScreenNativeComponent';
import { SplitScreenProps } from './SplitScreen.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function Column(props: SplitScreenProps) {
  return (
    <SplitScreenNativeComponent
      columnType="column"
      {...props}
      style={StyleSheet.absoluteFill}>
      {props.children}
    </SplitScreenNativeComponent>
  );
}

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function Inspector(props: SplitScreenProps) {
  return (
    <SplitScreenNativeComponent
      columnType="inspector"
      {...props}
      style={StyleSheet.absoluteFill}>
      {props.children}
    </SplitScreenNativeComponent>
  );
}

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
// TODO: refactor to drop `Screen` suffix as the API name is really long at the moment
const SplitScreen = {
  Column,
  Inspector,
};

export default SplitScreen;
