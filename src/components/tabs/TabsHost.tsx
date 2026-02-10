'use client';

import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  findNodeHandle,
  type NativeSyntheticEvent,
} from 'react-native';
import BottomTabsNativeComponent, {
  type NativeTabBarHeightChangeEvent,
  type NativeProps as BottomTabsNativeComponentProps,
} from '../../fabric/bottom-tabs/BottomTabsNativeComponent';
import featureFlags from '../../flags';
import type { TabsHostProps, NativeFocusChangeEvent } from './TabsHost.types';
import { bottomTabsDebugLog } from '../../private/logging';
import TabsAccessory from './TabsAccessory';
import { TabsAccessoryEnvironment } from './TabsAccessory.types';
import TabsAccessoryContent from './TabsAccessoryContent';
import { BottomTabBarHeightContext } from './BottomTabBarHeightContext';

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
    useState<TabsAccessoryEnvironment>('regular');
  const [tabBarHeight, setTabBarHeight] = useState(0);

  const onTabBarHeightChangeCallback = React.useCallback(
    (event: NativeSyntheticEvent<NativeTabBarHeightChangeEvent>) => {
      const nextHeight = event.nativeEvent.height;
      setTabBarHeight(prevHeight =>
        prevHeight === nextHeight ? prevHeight : nextHeight,
      );
    },
    [],
  );

  return (
    <BottomTabBarHeightContext.Provider value={tabBarHeight}>
      <BottomTabsNativeComponent
        style={styles.fillParent}
        onNativeFocusChange={onNativeFocusChangeCallback}
        onTabBarHeightChange={onTabBarHeightChangeCallback}
        controlNavigationStateInJS={experimentalControlNavigationStateInJS}
        nativeContainerBackgroundColor={nativeContainerStyle?.backgroundColor}
        // @ts-ignore suppress ref - debug only
        ref={componentNodeRef}
        {...filteredProps}>
        {filteredProps.children}
        {bottomAccessory &&
          Platform.OS === 'ios' &&
          parseInt(Platform.Version, 10) >= 26 &&
          (Platform.constants.reactNativeVersion.minor >= 82 ? (
            <TabsAccessory>
              <TabsAccessoryContent environment="regular">
                {bottomAccessory('regular')}
              </TabsAccessoryContent>
              <TabsAccessoryContent environment="inline">
                {bottomAccessory('inline')}
              </TabsAccessoryContent>
            </TabsAccessory>
          ) : (
            <TabsAccessory
              onEnvironmentChange={event => {
                setBottomAccessoryEnvironment(event.nativeEvent.environment);
              }}>
              {bottomAccessory(bottomAccessoryEnvironment)}
            </TabsAccessory>
          ))}
      </BottomTabsNativeComponent>
    </BottomTabBarHeightContext.Provider>
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
