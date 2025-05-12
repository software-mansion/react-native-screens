'use client';

import React from 'react';
import BottomTabsNativeComponent, {
  type NativeProps as BottomTabsNativeComponentProps,
} from '../fabric/BottomTabsNativeComponent';
import { StyleSheet } from 'react-native';

export type BottomTabsProps = BottomTabsNativeComponentProps;

// export interface BottomTabsProps {
//   children: React.ReactNode;
// }

function BottomTabs(props: BottomTabsProps) {
  return (
    <BottomTabsNativeComponent style={styles.fillParent} {...props}>
      {props.children}
    </BottomTabsNativeComponent>
  );
}

export default BottomTabs;

const styles = StyleSheet.create({
  fillParent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
