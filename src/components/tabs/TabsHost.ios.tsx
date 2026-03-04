'use client';

import React, { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import TabsHostIOSNativeComponent, {
  type NativeProps as TabsHostIOSNativeComponentProps,
} from '../../fabric/tabs/TabsHostIOSNativeComponent';
import type { TabsHostProps } from './TabsHost.types';
import { bottomTabsDebugLog } from '../../private/logging';
import TabsBottomAccessory from './TabsBottomAccessory';
import { TabsBottomAccessoryEnvironment } from './TabsBottomAccessory.types';
import TabsBottomAccessoryContent from './TabsBottomAccessoryContent';
import { isIOS26OrHigher } from '../helpers/PlatformUtils';
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
    direction,
    experimentalControlNavigationStateInJS,
    onNativeFocusChange,
    ...filteredBaseProps
  } = baseProps;

  const componentNodeRef =
    React.useRef<React.Component<TabsHostIOSNativeComponentProps>>(null);

  const { controlNavigationStateInJS, onNativeFocusChangeCallback } =
    useTabsHost<TabsHostIOSNativeComponentProps>({
      componentNodeRef,
      controlNavigationStateInJS: experimentalControlNavigationStateInJS,
      onNativeFocusChange,
    });

  const [bottomAccessoryEnvironment, setBottomAccessoryEnvironment] =
    useState<TabsBottomAccessoryEnvironment>('regular');

  return (
    <TabsHostIOSNativeComponent
      style={styles.fillParent}
      onNativeFocusChange={onNativeFocusChangeCallback}
      controlNavigationStateInJS={controlNavigationStateInJS}
      nativeContainerBackgroundColor={nativeContainerStyle?.backgroundColor}
      layoutDirection={direction}
      // @ts-ignore suppress ref - debug only
      ref={componentNodeRef}
      {...filteredBaseProps}
      // iOS-specific
      tabBarTintColor={ios?.tabBarTintColor}
      tabBarMinimizeBehavior={ios?.tabBarMinimizeBehavior}
      tabBarControllerMode={ios?.tabBarControllerMode}
      colorScheme={ios?.colorScheme}>
      {baseProps.children}
      {ios?.bottomAccessory &&
        isIOS26OrHigher &&
        (Platform.constants.reactNativeVersion.minor >= 82 ? (
          <TabsBottomAccessory>
            <TabsBottomAccessoryContent environment="regular">
              {ios.bottomAccessory('regular')}
            </TabsBottomAccessoryContent>
            <TabsBottomAccessoryContent environment="inline">
              {ios.bottomAccessory('inline')}
            </TabsBottomAccessoryContent>
          </TabsBottomAccessory>
        ) : (
          <TabsBottomAccessory
            onEnvironmentChange={event => {
              setBottomAccessoryEnvironment(event.nativeEvent.environment);
            }}>
            {ios.bottomAccessory(bottomAccessoryEnvironment)}
          </TabsBottomAccessory>
        ))}
    </TabsHostIOSNativeComponent>
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
