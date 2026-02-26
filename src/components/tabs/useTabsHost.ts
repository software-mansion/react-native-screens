import React from 'react';
import { findNodeHandle, type NativeSyntheticEvent } from 'react-native';
import type { NativeProps as TabsHostNativeComponentProps } from '../../fabric/tabs/TabsHostNativeComponent';
import featureFlags from '../../flags';
import { bottomTabsDebugLog } from '../../private/logging';
import type { NativeFocusChangeEvent } from './TabsHost.types';

interface TabsHostConfig {
  controlNavigationStateInJS?: boolean;
  onNativeFocusChange?: (
    event: NativeSyntheticEvent<NativeFocusChangeEvent>,
  ) => void;
}

export function useTabsHost(config: TabsHostConfig) {
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
      config.onNativeFocusChange?.(event);
    },
    [config.onNativeFocusChange],
  );

  const controlNavigationStateInJS =
    config.controlNavigationStateInJS ??
    featureFlags.experiment.controlledBottomTabs;

  return {
    componentNodeRef,
    controlNavigationStateInJS,
    onNativeFocusChangeCallback,
  };
}
