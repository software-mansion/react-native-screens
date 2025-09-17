import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import TabsSafeAreaViewNativeComponent from '../../fabric/bottom-tabs/TabsSafeAreaViewNativeComponent';

export interface TabsSafeAreaViewProps extends ViewProps {}

function TabsSafeAreaView(props: TabsSafeAreaViewProps) {
  const [marginBottom, setMarginBottom] = React.useState(0);

  return (
    <TabsSafeAreaViewNativeComponent
      {...props}
      collapsable={false}
      style={[styles.safeAreaView, { marginBottom }]}
      onNativeLayout={event => {
        console.log(
          `Received tabBarHeight on JS side ${event.nativeEvent.tabBarHeight}`,
        );
        setMarginBottom(event.nativeEvent.tabBarHeight);
      }}
    />
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
});

export default TabsSafeAreaView;
