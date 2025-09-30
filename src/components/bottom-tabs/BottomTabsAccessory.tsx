import React from 'react';
import { ViewProps } from 'react-native';
import BottomTabsAccessoryNativeComponent from '../../fabric/bottom-tabs/BottomTabsAccessoryNativeComponent';

export type BottomTabsAccessoryProps = ViewProps;

export default function BottomTabsAccessory(props: BottomTabsAccessoryProps) {
  return (
    <BottomTabsAccessoryNativeComponent
      style={[props.style, { flex: 1, position: 'absolute' }]}>
      {props.children}
    </BottomTabsAccessoryNativeComponent>
  );
}
