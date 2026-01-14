import React from 'react';
import BottomTabsAccessoryNativeComponent from '../../fabric/bottom-tabs/BottomTabsAccessoryNativeComponent';
import { TabsAccessoryProps } from './TabsAccessory.types';
import { StyleSheet } from 'react-native';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export default function TabsAccessory(props: TabsAccessoryProps) {
  return (
    <BottomTabsAccessoryNativeComponent
      {...props}
      collapsable={false}
      style={[props.style, StyleSheet.absoluteFill]}
    />
  );
}
