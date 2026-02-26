import React from 'react';
import { findNodeHandle, type NativeSyntheticEvent } from 'react-native';
import type { NativeProps as TabsScreenAndroidNativeComponentProps } from '../../fabric/tabs/TabsScreenAndroidNativeComponent';
import type { NativeProps as TabsScreenIOSNativeComponentProps } from '../../fabric/tabs/TabsScreenIOSNativeComponent';
import { bottomTabsDebugLog } from '../../private/logging';
import type { EmptyObject, TabsScreenEventHandler } from './TabsScreen.types';

type PlatformNativeProps =
  | TabsScreenAndroidNativeComponentProps
  | TabsScreenIOSNativeComponentProps;

interface TabsScreenConfig<T> {
  componentNodeRef: React.RefObject<React.Component<T> | null>;
  onDidAppear?: TabsScreenEventHandler<EmptyObject>;
  onDidDisappear?: TabsScreenEventHandler<EmptyObject>;
  onWillAppear?: TabsScreenEventHandler<EmptyObject>;
  onWillDisappear?: TabsScreenEventHandler<EmptyObject>;
  isFocused?: boolean;
  tabKey: string;
}

export function useTabsScreen<T extends PlatformNativeProps>({
  componentNodeRef,
  onDidAppear,
  onDidDisappear,
  onWillAppear,
  onWillDisappear,
  isFocused = false,
  tabKey,
}: TabsScreenConfig<T>) {
  const componentNodeHandle = React.useRef<number>(-1);

  React.useEffect(() => {
    if (componentNodeRef.current != null) {
      componentNodeHandle.current =
        findNodeHandle(componentNodeRef.current) ?? -1;
    } else {
      componentNodeHandle.current = -1;
    }
  }, []);

  const onWillAppearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${componentNodeHandle.current}] onWillAppear received`,
      );
      onWillAppear?.(event);
    },
    [onWillAppear],
  );

  const onDidAppearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${componentNodeHandle.current}] onDidAppear received`,
      );
      onDidAppear?.(event);
    },
    [onDidAppear],
  );

  const onWillDisappearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${componentNodeHandle.current}] onWillDisappear received`,
      );
      onWillDisappear?.(event);
    },
    [onWillDisappear],
  );

  const onDidDisappearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${componentNodeHandle.current}] onDidDisappear received`,
      );
      onDidDisappear?.(event);
    },
    [onDidDisappear],
  );

  bottomTabsDebugLog(
    `TabsScreen [${
      componentNodeHandle.current ?? -1
    }] render; tabKey: ${tabKey}, isFocused: ${isFocused}`,
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
