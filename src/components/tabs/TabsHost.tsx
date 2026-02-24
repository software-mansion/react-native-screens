'use client';

import React, { useState } from 'react';
import {
  I18nManager,
  Platform,
  StyleSheet,
  findNodeHandle,
  type NativeSyntheticEvent,
} from 'react-native';
import TabsHostNativeComponent, {
  type NativeProps as TabsHostNativeComponentProps,
} from '../../fabric/tabs/TabsHostNativeComponent';
import featureFlags from '../../flags';
import type { TabsHostProps, NativeFocusChangeEvent } from './TabsHost.types';
import { bottomTabsDebugLog } from '../../private/logging';
import TabsAccessory from './TabsAccessory';
import { TabsAccessoryEnvironment } from './TabsAccessory.types';
import TabsAccessoryContent from './TabsAccessoryContent';
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
    useState<TabsAccessoryEnvironment>('regular');

  return (
    <TabsHostNativeComponent
      style={[styles.fillParent, styles.forceLtrForIOS26]}
      onNativeFocusChange={onNativeFocusChangeCallback}
      controlNavigationStateInJS={experimentalControlNavigationStateInJS}
      nativeContainerBackgroundColor={nativeContainerStyle?.backgroundColor}
      directionMode={I18nManager.isRTL ? 'rtl' : 'ltr'}
      // @ts-ignore suppress ref - debug only
      ref={componentNodeRef}
      {...filteredProps}>
      {filteredProps.children}
      {bottomAccessory &&
        isIOS26OrHigher &&
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
  // For TabsBottomAccessory layout to work correctly, we need to use
  // `ltr`. We restore direction in children views.
  forceLtrForIOS26: {
    direction: isIOS26OrHigher ? 'ltr' : undefined,
  },
});
