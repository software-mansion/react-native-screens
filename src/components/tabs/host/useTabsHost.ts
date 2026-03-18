import React from 'react';
import { findNodeHandle, type NativeSyntheticEvent } from 'react-native';
import type { NativeProps as TabsHostAndroidNativeComponentProps } from '../../../fabric/tabs/TabsHostAndroidNativeComponent';
import type { NativeProps as TabsHostIOSNativeComponentProps } from '../../../fabric/tabs/TabsHostIOSNativeComponent';
import featureFlags from '../../../flags';
import { RNSLog } from '../../../private';
import type { TabChangeEvent } from './TabsHost.types';

type TabsHostPlatformNativeComponentProps =
  | TabsHostAndroidNativeComponentProps
  | TabsHostIOSNativeComponentProps;

interface TabsHostConfig<T> {
  componentNodeRef: React.RefObject<React.Component<T> | null>;
  controlNavigationStateInJS?: boolean;
  onTabChange?: (event: NativeSyntheticEvent<TabChangeEvent>) => void;
}

export function useTabsHost<T extends TabsHostPlatformNativeComponentProps>({
  componentNodeRef,
  controlNavigationStateInJS,
  onTabChange,
}: TabsHostConfig<T>) {
  const componentNodeHandle = React.useRef<number>(-1);

  React.useEffect(() => {
    if (componentNodeRef.current != null) {
      componentNodeHandle.current =
        findNodeHandle(componentNodeRef.current) ?? -1;
    } else {
      componentNodeHandle.current = -1;
    }
  }, []);

  const onTabChangeCallback = React.useCallback(
    (event: NativeSyntheticEvent<TabChangeEvent>) => {
      RNSLog.log(
        `TabsHost [${
          componentNodeHandle.current ?? -1
        }] onTabChange: ${JSON.stringify(event.nativeEvent)}`,
      );
      onTabChange?.(event);
    },
    [onTabChange],
  );

  return {
    controlNavigationStateInJS:
      controlNavigationStateInJS ??
      featureFlags.experiment.controlledBottomTabs,
    onTabChange: onTabChangeCallback,
  };
}
