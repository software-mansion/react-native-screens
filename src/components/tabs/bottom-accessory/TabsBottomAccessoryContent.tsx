import React from 'react';
import { StyleSheet } from 'react-native';
import { TabsBottomAccessoryContentProps } from './TabsBottomAccessoryContent.types';
import TabsBottomAccessoryContentNativeComponent from '../../../fabric/tabs/TabsBottomAccessoryContentNativeComponent';

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
