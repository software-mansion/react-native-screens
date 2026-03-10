import React from 'react';
import { findNodeHandle, type NativeSyntheticEvent } from 'react-native';
import type { NativeProps as TabsScreenAndroidNativeComponentProps } from '../../fabric/tabs/TabsScreenAndroidNativeComponent';
import type { NativeProps as TabsScreenIOSNativeComponentProps } from '../../fabric/tabs/TabsScreenIOSNativeComponent';
import { bottomTabsDebugLog } from '../../private/logging';
import type { EmptyObject, TabsScreenEventHandler } from './TabsScreen.types';
import { useRenderDebugInfo } from '../../private/hooks/useRenderDebugInfo';

type TabsScreenPlatformNativeComponentProps =
  | TabsScreenAndroidNativeComponentProps
  | TabsScreenIOSNativeComponentProps;

interface TabsScreenConfig {
  onDidAppear?: TabsScreenEventHandler<EmptyObject>;
  onDidDisappear?: TabsScreenEventHandler<EmptyObject>;
  onWillAppear?: TabsScreenEventHandler<EmptyObject>;
  onWillDisappear?: TabsScreenEventHandler<EmptyObject>;
  isFocused?: boolean;
  tabKey: string;
}

export function useTabsScreen<
  T extends TabsScreenPlatformNativeComponentProps,
>({
  onDidAppear,
  onDidDisappear,
  onWillAppear,
  onWillDisappear,
  isFocused = false,
  tabKey,
}: TabsScreenConfig) {
  const componentNodeRef = useRenderDebugInfo<React.Component<T>>(
    `TabsScreen (${tabKey})`,
  );

  const componentNodeHandleRef = React.useRef<number>(-1);

  React.useEffect(() => {
    if (componentNodeHandleRef.current === -1 && componentNodeRef.current) {
      componentNodeHandleRef.current =
        findNodeHandle(componentNodeRef.current) ?? -1;
    }
  });

  const onWillAppearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${componentNodeHandleRef.current}] onWillAppear received`,
      );
      onWillAppear?.(event);
    },
    [onWillAppear],
  );

  const onDidAppearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${componentNodeHandleRef.current}] onDidAppear received`,
      );
      onDidAppear?.(event);
    },
    [onDidAppear],
  );

  const onWillDisappearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${componentNodeHandleRef.current}] onWillDisappear received`,
      );
      onWillDisappear?.(event);
    },
    [onWillDisappear],
  );

  const onDidDisappearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${componentNodeHandleRef.current}] onDidDisappear received`,
      );
      onDidDisappear?.(event);
    },
    [onDidDisappear],
  );

  bottomTabsDebugLog(
    `TabsScreen [${componentNodeHandleRef.current}] render; tabKey: ${tabKey}, isFocused: ${isFocused}`,
  );

  return {
    componentNodeRef,
    lifecycleCallbacks: {
      onWillAppear: onWillAppearCallback,
      onDidAppear: onDidAppearCallback,
      onWillDisappear: onWillDisappearCallback,
      onDidDisappear: onDidDisappearCallback,
    },
  };
}
