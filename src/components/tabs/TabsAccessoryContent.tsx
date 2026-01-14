import React from 'react';
import { StyleSheet } from 'react-native';
import { TabsAccessoryContentProps } from './TabsAccessoryContent.types';
import BottomTabsAccessoryContentNativeComponent from '../../fabric/bottom-tabs/BottomTabsAccessoryContentNativeComponent';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export default function TabsAccessoryContent(props: TabsAccessoryContentProps) {
  return (
    <BottomTabsAccessoryContentNativeComponent
      {...props}
      collapsable={false}
      style={[props.style, StyleSheet.absoluteFill]}
    />
  );
}
