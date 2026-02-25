import React from 'react';
import { findNodeHandle, type NativeSyntheticEvent } from 'react-native';
import type { NativeProps as TabsHostNativeComponentProps } from '../../fabric/tabs/TabsHostNativeComponent';
import featureFlags from '../../flags';
import { bottomTabsDebugLog } from '../../private/logging';
import type {
  TabsHostPropsBase,
  NativeFocusChangeEvent,
} from './TabsHost.types';

export function useTabsHost(props: TabsHostPropsBase) {
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
      props.onNativeFocusChange?.(event);
    },
    [props.onNativeFocusChange],
  );

  const experimentalControlNavigationStateInJS =
    props.experimentalControlNavigationStateInJS ??
    featureFlags.experiment.controlledBottomTabs;

  return {
    componentNodeRef,
    experimentalControlNavigationStateInJS,
    onNativeFocusChangeCallback,
  };
}
