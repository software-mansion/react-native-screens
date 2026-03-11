import React from 'react';
import { StyleSheet } from 'react-native';
import { TabsBottomAccessoryContentProps } from './TabsBottomAccessoryContent.types';
import TabsBottomAccessoryContentNativeComponent from '../../../fabric/tabs/TabsBottomAccessoryContentNativeComponent';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export default function TabsBottomAccessoryContent(
  props: TabsBottomAccessoryContentProps,
) {
  return (
    <TabsBottomAccessoryContentNativeComponent
      {...props}
      collapsable={false}
      style={[props.style, StyleSheet.absoluteFill]}
    />
  );
}
