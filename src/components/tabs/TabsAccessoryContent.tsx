import React from 'react';
import { StyleSheet } from 'react-native';
import { TabsAccessoryContentProps } from './TabsAccessoryContent.types';
import TabsBottomAccessoryContentNativeComponent from '../../fabric/tabs/TabsBottomAccessoryContentNativeComponent';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export default function TabsAccessoryContent(props: TabsAccessoryContentProps) {
  return (
    <TabsBottomAccessoryContentNativeComponent
      {...props}
      collapsable={false}
      style={[props.style, StyleSheet.absoluteFill]}
    />
  );
}
