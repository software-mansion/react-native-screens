import React from 'react';
import { ViewProps } from 'react-native';
import TabsSafeAreaViewNativeComponent from '../../fabric/bottom-tabs/TabsSafeAreaViewNativeComponent';

export interface TabsSafeAreaViewProps extends ViewProps {}

function TabsSafeAreaView(props: TabsSafeAreaViewProps) {
  return (
    <TabsSafeAreaViewNativeComponent
      {...props}
      collapsable={false}
      onNativeLayout={event => {
        console.log(
          `Received tabBarHeight on JS side ${event.nativeEvent.tabBarHeight}`,
        );
      }}
    />
  );
}

export default TabsSafeAreaView;
