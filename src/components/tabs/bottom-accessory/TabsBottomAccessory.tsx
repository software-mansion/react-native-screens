import React from 'react';
import TabsBottomAccessoryNativeComponent from '../../../fabric/tabs/TabsBottomAccessoryNativeComponent';
import { TabsBottomAccessoryProps } from './TabsBottomAccessory.types';
import { StyleSheet } from 'react-native';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export default function TabsBottomAccessory(props: TabsBottomAccessoryProps) {
  return (
    <TabsBottomAccessoryNativeComponent
      {...props}
      collapsable={false}
      style={[props.style, StyleSheet.absoluteFill]}
    />
  );
}
