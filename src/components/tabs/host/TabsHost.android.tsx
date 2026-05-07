'use client';

import React from 'react';
import { StyleSheet } from 'react-native';
import TabsHostAndroidNativeComponent, {
  type NativeProps as TabsHostAndroidNativeComponentProps,
} from '../../../fabric/tabs/TabsHostAndroidNativeComponent';
import type { TabsHostProps } from './TabsHost.types';
import { RNSLog } from '../../../private';
import { useTabsHost } from './useTabsHost';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function TabsHost(props: TabsHostProps) {
  RNSLog.log(`TabsHost render`);

  // android props (even if unused for now) are extracted - these should be handled separately from base props
  // ios props are safely dropped
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { android, ios, ...baseProps } = props;

  const {
    children,
    direction,
    nativeContainerStyle,
    onTabSelected,
    navStateRequest,
    ...filteredBaseProps
  } = baseProps;

  const componentNodeRef =
    React.useRef<React.Component<TabsHostAndroidNativeComponentProps>>(null);

  const { onTabSelected: onTabSelectedCallback } =
    useTabsHost<TabsHostAndroidNativeComponentProps>({
      componentNodeRef,
      onTabSelected,
    });

  return (
    <TabsHostAndroidNativeComponent
      style={[styles.fillParent, { direction }]}
      navStateRequest={navStateRequest}
      onTabSelected={onTabSelectedCallback}
      nativeContainerBackgroundColor={nativeContainerStyle?.backgroundColor}
      // @ts-ignore suppress ref - debug only
      ref={componentNodeRef}
      {...filteredBaseProps}
      // Android-specific
      tabBarRespectsIMEInsets={android?.tabBarRespectsIMEInsets}>
      {children}
    </TabsHostAndroidNativeComponent>
  );
}

export default TabsHost;

const styles = StyleSheet.create({
  fillParent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
