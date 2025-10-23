import React from 'react';
import BottomTabsAccessoryNativeComponent from '../../fabric/bottom-tabs/BottomTabsAccessoryNativeComponent';
import { BottomTabsAccessoryProps } from './BottomTabsAccessory.types';
import { StyleSheet } from 'react-native';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export default function BottomTabsAccessory(props: BottomTabsAccessoryProps) {
  return (
    <BottomTabsAccessoryNativeComponent
      {...props}
      collapsable={false}
      style={[props.style, styles.container]}>
      {props.children}
    </BottomTabsAccessoryNativeComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
  },
});
