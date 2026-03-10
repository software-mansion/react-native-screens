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

  const getComponentNodeHandle = React.useCallback(() => {
    return componentNodeRef.current
      ? findNodeHandle(componentNodeRef.current) ?? -1
      : -1;
  }, [componentNodeRef]);

  const onWillAppearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${getComponentNodeHandle()}] onWillAppear received`,
      );
      onWillAppear?.(event);
    },
    [onWillAppear, getComponentNodeHandle],
  );

  const onDidAppearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${getComponentNodeHandle()}] onDidAppear received`,
      );
      onDidAppear?.(event);
    },
    [onDidAppear, getComponentNodeHandle],
  );

  const onWillDisappearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${getComponentNodeHandle()}] onWillDisappear received`,
      );
      onWillDisappear?.(event);
    },
    [onWillDisappear, getComponentNodeHandle],
  );

  const onDidDisappearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${getComponentNodeHandle()}] onDidDisappear received`,
      );
      onDidDisappear?.(event);
    },
    [onDidDisappear, getComponentNodeHandle],
  );

  bottomTabsDebugLog(
    `TabsScreen [${getComponentNodeHandle()}] render; tabKey: ${tabKey}, isFocused: ${isFocused}`,
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
