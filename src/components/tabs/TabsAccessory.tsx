import React from 'react';
import TabsBottomAccessoryNativeComponent from '../../fabric/tabs/TabsBottomAccessoryNativeComponent';
import { TabsAccessoryProps } from './TabsAccessory.types';
import { StyleSheet } from 'react-native';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export default function TabsAccessory(props: TabsAccessoryProps) {
  return (
    <TabsBottomAccessoryNativeComponent
      {...props}
      collapsable={false}
      style={[props.style, StyleSheet.absoluteFill]}
    />
  );
}
