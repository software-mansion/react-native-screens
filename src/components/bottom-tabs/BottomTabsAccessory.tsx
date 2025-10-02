import React from 'react';
import { ViewProps } from 'react-native';
import BottomTabsAccessoryNativeComponent from '../../fabric/bottom-tabs/BottomTabsAccessoryNativeComponent';

export type BottomTabsAccessoryProps = ViewProps;

export default function BottomTabsAccessory(props: BottomTabsAccessoryProps) {
  return (
    <BottomTabsAccessoryNativeComponent
      collapsable={false}
      style={[
        props.style,
        // {
        //   position: 'absolute',
        // },
        {
          // width: 360,
          // height: 48,
          position: 'absolute',
          flex: 1,
          // top: 735,
          // left: 21,
          // margin: 10,
          // overflow: 'hidden',
          // borderRadius: 20,
          // backgroundColor: 'transparent',
        },
      ]}>
      {props.children}
    </BottomTabsAccessoryNativeComponent>
  );
}
