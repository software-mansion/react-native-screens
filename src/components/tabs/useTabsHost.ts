import React from 'react';
import { findNodeHandle, type NativeSyntheticEvent } from 'react-native';
import type { NativeProps as TabsHostAndroidNativeComponentProps } from '../../fabric/tabs/TabsHostAndroidNativeComponent';
import type { NativeProps as TabsHostIOSNativeComponentProps } from '../../fabric/tabs/TabsHostIOSNativeComponent';
import featureFlags from '../../flags';
import { bottomTabsDebugLog } from '../../private/logging';
import type { NativeFocusChangeEvent } from './TabsHost.types';

type PlatformNativeProps =
  | TabsHostAndroidNativeComponentProps
  | TabsHostIOSNativeComponentProps;

interface TabsHostConfig<T> {
  componentNodeRef: React.RefObject<React.Component<T> | null>,
  controlNavigationStateInJS?: boolean;
  onNativeFocusChange?: (
    event: NativeSyntheticEvent<NativeFocusChangeEvent>,
  ) => void;
}

export function useTabsHost<T extends PlatformNativeProps>(config: TabsHostConfig<T>) {
  const componentNodeHandle = React.useRef<number>(-1);

  React.useEffect(() => {
    if (config.componentNodeRef.current != null) {
      componentNodeHandle.current =
        findNodeHandle(config.componentNodeRef.current) ?? -1;
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
    controlNavigationStateInJS,
    onNativeFocusChangeCallback,
  };
}
