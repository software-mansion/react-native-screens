import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomTabsAccessoryContentProps } from './BottomTabsAccessoryContent.types';
import BottomTabsAccessoryContentNativeComponent from '../../fabric/bottom-tabs/BottomTabsAccessoryContentNativeComponent';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export default function BottomTabsAccessoryContent(
  props: BottomTabsAccessoryContentProps,
) {
  return (
    <BottomTabsAccessoryContentNativeComponent
      {...props}
      collapsable={false}
      style={[props.style, StyleSheet.absoluteFill]}
    />
  );
}
