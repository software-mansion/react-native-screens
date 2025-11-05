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
      style={[props.style, styles.container]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
