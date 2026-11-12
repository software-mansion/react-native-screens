import React from 'react';
import { StyleSheet } from 'react-native';
import SplitScreenNativeComponent from '../../fabric/split/SplitScreenNativeComponent';
import type {
  SplitColumnProps,
  SplitInspectorProps,
} from './SplitScreen.types';

function Column(props: SplitColumnProps) {
  return (
    <SplitScreenNativeComponent
      columnType="column"
      {...props}
      style={StyleSheet.absoluteFill}>
      {props.children}
    </SplitScreenNativeComponent>
  );
}

function Inspector(props: SplitInspectorProps) {
  return (
    <SplitScreenNativeComponent
      columnType="inspector"
      {...props}
      style={StyleSheet.absoluteFill}>
      {props.children}
    </SplitScreenNativeComponent>
  );
}

// TODO: refactor to drop `Screen` suffix as the API name is really long at the moment
const SplitScreen = {
  Column,
  Inspector,
};

export default SplitScreen;
