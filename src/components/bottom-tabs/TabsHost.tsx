'use client';

import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  findNodeHandle,
  type NativeSyntheticEvent,
} from 'react-native';
import BottomTabsNativeComponent, {
  type NativeProps as BottomTabsNativeComponentProps,
} from '../../fabric/bottom-tabs/BottomTabsNativeComponent';
import featureFlags from '../../flags';
import type { TabsHostProps, NativeFocusChangeEvent } from './TabsHost.types';
import { bottomTabsDebugLog } from '../../private/logging';
import BottomTabsAccessory from './BottomTabsAccessory';
import { BottomTabsAccessoryEnvironment } from './BottomTabsAccessory.types';
import BottomTabsAccessoryContent from './BottomTabsAccessoryContent';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function TabsHost(props: TabsHostProps) {
  bottomTabsDebugLog(`TabsHost render`);

  const {
    onNativeFocusChange,
    experimentalControlNavigationStateInJS = featureFlags.experiment
      .controlledBottomTabs,
    tabAccessory,
    ...filteredProps
  } = props;

  const componentNodeRef =
    React.useRef<React.Component<BottomTabsNativeComponentProps>>(null);
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
    useState<BottomTabsAccessoryEnvironment>('regular');

  return (
    <BottomTabsNativeComponent
      style={styles.fillParent}
      onNativeFocusChange={onNativeFocusChangeCallback}
      controlNavigationStateInJS={experimentalControlNavigationStateInJS}
      // @ts-ignore suppress ref - debug only
      ref={componentNodeRef}
      {...filteredProps}>
      {filteredProps.children}
      {tabAccessory &&
        Platform.OS === 'ios' &&
        parseInt(Platform.Version, 10) >= 26 &&
        (Platform.constants.reactNativeVersion.minor >= 82 ? (
          <BottomTabsAccessory>
            <BottomTabsAccessoryContent environment="regular">
              {tabAccessory('regular')}
            </BottomTabsAccessoryContent>
            <BottomTabsAccessoryContent environment="inline">
              {tabAccessory('inline')}
            </BottomTabsAccessoryContent>
          </BottomTabsAccessory>
        ) : (
          <BottomTabsAccessory
            onEnvironmentChange={event => {
              setBottomAccessoryEnvironment(event.nativeEvent.environment);
            }}>
            {tabAccessory(bottomAccessoryEnvironment)}
          </BottomTabsAccessory>
        ))}
    </BottomTabsNativeComponent>
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
