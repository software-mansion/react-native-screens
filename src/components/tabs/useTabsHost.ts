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

  const componentNodeHandleRef = React.useRef<number>(-1);

  React.useEffect(() => {
    if (componentNodeHandleRef.current === -1 && componentNodeRef.current) {
      componentNodeHandleRef.current =
        findNodeHandle(componentNodeRef.current) ?? -1;
    }
  });

  const onNativeFocusChangeCallback = React.useCallback(
    (event: NativeSyntheticEvent<NativeFocusChangeEvent>) => {
      bottomTabsDebugLog(
        `TabsHost [${
          componentNodeHandleRef.current
        }] onNativeFocusChange: ${JSON.stringify(event.nativeEvent)}`,
      );
      onNativeFocusChange?.(event);
    },
    [onNativeFocusChange],
  );

  return {
    componentNodeRef,
    controlNavigationStateInJS:
      controlNavigationStateInJS ??
      featureFlags.experiment.controlledBottomTabs,
    onNativeFocusChangeCallback,
  };
}
