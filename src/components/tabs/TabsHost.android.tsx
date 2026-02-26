'use client';

import React from 'react';
import { StyleSheet } from 'react-native';
import TabsHostAndroidNativeComponent from '../../fabric/tabs/TabsHostAndroidNativeComponent';
import type { NativeProps as TabsHostAndroidNativeComponentProps } from '../../fabric/tabs/TabsHostAndroidNativeComponent';
import type { TabsHostProps } from './TabsHost.types';
import { bottomTabsDebugLog } from '../../private/logging';
import { useTabsHost } from './useTabsHost';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function TabsHost(props: TabsHostProps) {
  bottomTabsDebugLog(`TabsHost render`);

  // android props (even if unused for now) are extracted - these should be handled separately from base props
  // ios props are safely dropped
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { android, ios, nativeContainerStyle, ...baseProps } = props;

  const componentNodeRef =
    React.useRef<React.Component<TabsHostAndroidNativeComponentProps>>(null);
  const {
    experimentalControlNavigationStateInJS,
    onNativeFocusChange,
    ...filteredBaseProps
  } = baseProps;

  const { controlNavigationStateInJS, onNativeFocusChangeCallback } =
    useTabsHost<TabsHostAndroidNativeComponentProps>({
      componentNodeRef,
      controlNavigationStateInJS: experimentalControlNavigationStateInJS,
      onNativeFocusChange,
    });

  return (
    <TabsHostAndroidNativeComponent
      style={styles.fillParent}
      onNativeFocusChange={onNativeFocusChangeCallback}
      controlNavigationStateInJS={controlNavigationStateInJS}
      nativeContainerBackgroundColor={nativeContainerStyle?.backgroundColor}
      // @ts-ignore suppress ref - debug only
      ref={componentNodeRef}
      {...filteredBaseProps}>
      {baseProps.children}
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
