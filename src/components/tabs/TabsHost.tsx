'use client';

import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  findNodeHandle,
  type NativeSyntheticEvent,
} from 'react-native';
import TabsHostNativeComponent, {
  type NativeProps as TabsHostNativeComponentProps,
} from '../../fabric/tabs/TabsHostNativeComponent';
import { featureFlags } from '../../flags';
import type { TabsHostProps, NativeFocusChangeEvent } from './TabsHost.types';
import { bottomTabsDebugLog } from '../../private/logging';
import TabsBottomAccessory from './TabsBottomAccessory';
import { TabsBottomAccessoryEnvironment } from './TabsBottomAccessory.types';
import TabsBottomAccessoryContent from './TabsBottomAccessoryContent';
import { isIOS26OrHigher } from '../helpers/PlatformUtils';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function TabsHost(props: TabsHostProps) {
  bottomTabsDebugLog(`TabsHost render`);

  const {
    onNativeFocusChange,
    experimentalControlNavigationStateInJS = featureFlags.experiment
      .controlledBottomTabs,
    bottomAccessory,
    nativeContainerStyle,
    direction,
    ...filteredProps
  } = props;

  const componentNodeRef =
    React.useRef<React.Component<TabsHostNativeComponentProps>>(null);
  const componentNodeHandle = React.useRef<number>(-1);

  React.useEffect(() => {
    if (componentNodeRef.current != null) {
      componentNodeHandle.current =
        findNodeHandle(componentNodeRef.current) ?? -1;
    } else {
      componentNodeHandle.current = -1;
    }
  }, []);

  const onNativeFocusChangeCallback = React.useCallback(
    (event: NativeSyntheticEvent<NativeFocusChangeEvent>) => {
      bottomTabsDebugLog(
        `TabsHost [${
          componentNodeHandle.current ?? -1
        }] onNativeFocusChange: ${JSON.stringify(event.nativeEvent)}`,
      );
      onNativeFocusChange?.(event);
    },
    [onNativeFocusChange],
  );

  const [bottomAccessoryEnvironment, setBottomAccessoryEnvironment] =
    useState<TabsBottomAccessoryEnvironment>('regular');

  return (
    <TabsHostNativeComponent
      style={[styles.fillParent, Platform.OS === 'android' && { direction }]}
      onNativeFocusChange={onNativeFocusChangeCallback}
      controlNavigationStateInJS={experimentalControlNavigationStateInJS}
      nativeContainerBackgroundColor={nativeContainerStyle?.backgroundColor}
      // `layoutDirection` is iOS-only
      layoutDirection={direction}
      // @ts-ignore suppress ref - debug only
      ref={componentNodeRef}
      {...filteredProps}>
      {filteredProps.children}
      {bottomAccessory &&
        isIOS26OrHigher &&
        (Platform.constants.reactNativeVersion.minor >= 82 ? (
          <TabsBottomAccessory>
            <TabsBottomAccessoryContent environment="regular">
              {bottomAccessory('regular')}
            </TabsBottomAccessoryContent>
            <TabsBottomAccessoryContent environment="inline">
              {bottomAccessory('inline')}
            </TabsBottomAccessoryContent>
          </TabsBottomAccessory>
        ) : (
          <TabsBottomAccessory
            onEnvironmentChange={event => {
              setBottomAccessoryEnvironment(event.nativeEvent.environment);
            }}>
            {bottomAccessory(bottomAccessoryEnvironment)}
          </TabsBottomAccessory>
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
