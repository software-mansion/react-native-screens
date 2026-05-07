import React from 'react';
import { findNodeHandle, type NativeSyntheticEvent } from 'react-native';
import type { NativeProps as TabsHostAndroidNativeComponentProps } from '../../../fabric/tabs/TabsHostAndroidNativeComponent';
import type { NativeProps as TabsHostIOSNativeComponentProps } from '../../../fabric/tabs/TabsHostIOSNativeComponent';
import { RNSLog } from '../../../private';
import type { TabSelectedEvent } from './TabsHost.types';

type TabsHostPlatformNativeComponentProps =
  | TabsHostAndroidNativeComponentProps
  | TabsHostIOSNativeComponentProps;

interface TabsHostConfig<T> {
  componentNodeRef: React.RefObject<React.Component<T> | null>;
  onTabSelected?:
    | ((event: NativeSyntheticEvent<TabSelectedEvent>) => void)
    | undefined;
}

export function useTabsHost<T extends TabsHostPlatformNativeComponentProps>({
  componentNodeRef,
  onTabSelected,
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

  const onTabSelectedCallback = React.useCallback(
    (event: NativeSyntheticEvent<TabSelectedEvent>) => {
      RNSLog.log(
        `TabsHost [${
          componentNodeHandle.current ?? -1
        }] onTabSelected: ${JSON.stringify(event.nativeEvent)}`,
      );
      onTabSelected?.(event);
    },
    [onTabSelected],
  );

  return {
    onTabSelected: onTabSelectedCallback,
  };
}
