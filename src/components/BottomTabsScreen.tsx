'use client';

import React from 'react';
import BottomTabsScreenNativeComponent from '../fabric/BottomTabScreenNativeComponent';
import { StyleSheet, ViewProps } from 'react-native';

export interface BottomTabsScreenProps {
  children: ViewProps['children'];
}

function BottomTabsScreen(props: BottomTabsScreenProps) {
  return (
    <BottomTabsScreenNativeComponent
      collapsable={false}
      style={styles.fillParent}
      {...props}>
      {props.children}
    </BottomTabsScreenNativeComponent>
  );
}

export default BottomTabsScreen;

const styles = StyleSheet.create({
  fillParent: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
