import React from 'react';
import { findNodeHandle, type NativeSyntheticEvent } from 'react-native';
import type { NativeProps as TabsHostAndroidNativeComponentProps } from '../../fabric/tabs/TabsHostAndroidNativeComponent';
import type { NativeProps as TabsHostIOSNativeComponentProps } from '../../fabric/tabs/TabsHostIOSNativeComponent';
import featureFlags from '../../flags';
import { bottomTabsDebugLog } from '../../private/logging';
import type { NativeFocusChangeEvent } from './TabsHost.types';
import { useRenderDebugInfo } from '../../private/hooks/useRenderDebugInfo';

type TabsHostPlatformNativeComponentProps =
  | TabsHostAndroidNativeComponentProps
  | TabsHostIOSNativeComponentProps;

interface TabsHostConfig {
  controlNavigationStateInJS?: boolean;
  onNativeFocusChange?: (
    event: NativeSyntheticEvent<NativeFocusChangeEvent>,
  ) => void;
}

export function useTabsHost<T extends TabsHostPlatformNativeComponentProps>({
  controlNavigationStateInJS,
  onNativeFocusChange,
}: TabsHostConfig) {
  const componentNodeRef = useRenderDebugInfo<React.Component<T>>('TabsHost');

  const getComponentNodeHandle = React.useCallback(() => {
    return componentNodeRef.current
      ? findNodeHandle(componentNodeRef.current) ?? -1
      : -1;
  }, [componentNodeRef]);

  const onNativeFocusChangeCallback = React.useCallback(
    (event: NativeSyntheticEvent<NativeFocusChangeEvent>) => {
      bottomTabsDebugLog(
        `TabsHost [${getComponentNodeHandle()}] onNativeFocusChange: ${JSON.stringify(
          event.nativeEvent,
        )}`,
      );
      onNativeFocusChange?.(event);
    },
    [getComponentNodeHandle, onNativeFocusChange],
  );

  return {
    componentNodeRef,
    controlNavigationStateInJS:
      controlNavigationStateInJS ??
      featureFlags.experiment.controlledBottomTabs,
    onNativeFocusChangeCallback,
  };
}
