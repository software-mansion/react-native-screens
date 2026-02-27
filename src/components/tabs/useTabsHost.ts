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
  componentNodeRef: React.RefObject<React.Component<T> | null>;
  controlNavigationStateInJS?: boolean;
  onNativeFocusChange?: (
    event: NativeSyntheticEvent<NativeFocusChangeEvent>,
  ) => void;
}

export function useTabsHost<T extends PlatformNativeProps>({
  componentNodeRef,
  controlNavigationStateInJS,
  onNativeFocusChange,
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

  return {
    controlNavigationStateInJS:
      controlNavigationStateInJS ??
      featureFlags.experiment.controlledBottomTabs,
    onNativeFocusChangeCallback,
  };
}
