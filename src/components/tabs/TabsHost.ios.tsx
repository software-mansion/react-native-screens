'use client';

import React, { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import TabsHostNativeComponent from '../../fabric/tabs/TabsHostNativeComponent';
import type { TabsHostProps } from './TabsHost.types';
import { bottomTabsDebugLog } from '../../private/logging';
import TabsAccessory from './TabsAccessory';
import { TabsAccessoryEnvironment } from './TabsAccessory.types';
import TabsAccessoryContent from './TabsAccessoryContent';
import { useTabsHost } from './useTabsHost';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function TabsHost(props: TabsHostProps) {
  bottomTabsDebugLog(`TabsHost render`);

  // android props are safely dropped
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ios, android, nativeContainerStyle, ...baseProps } = props;
  const {
    componentNodeRef,
    experimentalControlNavigationStateInJS,
    onNativeFocusChangeCallback,
  } = useTabsHost(baseProps);

  const [bottomAccessoryEnvironment, setBottomAccessoryEnvironment] =
    useState<TabsAccessoryEnvironment>('regular');

  return (
    <TabsHostNativeComponent
      style={styles.fillParent}
      onNativeFocusChange={onNativeFocusChangeCallback}
      controlNavigationStateInJS={experimentalControlNavigationStateInJS}
      nativeContainerBackgroundColor={nativeContainerStyle?.backgroundColor}
      // @ts-ignore suppress ref - debug only
      ref={componentNodeRef}
      {...baseProps}
      // iOS-specific
      tabBarTintColor={ios?.tabBarTintColor}
      tabBarMinimizeBehavior={ios?.tabBarMinimizeBehavior}
      tabBarControllerMode={ios?.tabBarControllerMode}>
      {baseProps.children}
      {ios?.bottomAccessory &&
        Platform.OS === 'ios' &&
        parseInt(Platform.Version, 10) >= 26 &&
        (Platform.constants.reactNativeVersion.minor >= 82 ? (
          <TabsAccessory>
            <TabsAccessoryContent environment="regular">
              {ios?.bottomAccessory('regular')}
            </TabsAccessoryContent>
            <TabsAccessoryContent environment="inline">
              {ios?.bottomAccessory('inline')}
            </TabsAccessoryContent>
          </TabsAccessory>
        ) : (
          <TabsAccessory
            onEnvironmentChange={event => {
              setBottomAccessoryEnvironment(event.nativeEvent.environment);
            }}>
            {ios?.bottomAccessory(bottomAccessoryEnvironment)}
          </TabsAccessory>
        ))}
    </TabsHostNativeComponent>
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
