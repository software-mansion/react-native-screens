import React from 'react';
import { findNodeHandle, type NativeSyntheticEvent } from 'react-native';
import type { NativeProps as TabsScreenAndroidNativeComponentProps } from '../../../fabric/tabs/TabsScreenAndroidNativeComponent';
import type { NativeProps as TabsScreenIOSNativeComponentProps } from '../../../fabric/tabs/TabsScreenIOSNativeComponent';
import { RNSLog } from '../../../private';
import type { EmptyObject, TabsScreenEventHandler } from './TabsScreen.types';

type TabsScreenPlatformNativeComponentProps =
  | TabsScreenAndroidNativeComponentProps
  | TabsScreenIOSNativeComponentProps;

interface TabsScreenConfig<T> {
  componentNodeRef: React.RefObject<React.Component<T> | null>;
  onDidAppear?: TabsScreenEventHandler<EmptyObject> | undefined;
  onDidDisappear?: TabsScreenEventHandler<EmptyObject> | undefined;
  onWillAppear?: TabsScreenEventHandler<EmptyObject> | undefined;
  onWillDisappear?: TabsScreenEventHandler<EmptyObject> | undefined;
  screenKey: string;
}

export function useTabsScreen<
  T extends TabsScreenPlatformNativeComponentProps,
>({
  componentNodeRef,
  onDidAppear,
  onDidDisappear,
  onWillAppear,
  onWillDisappear,
  screenKey,
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
      RNSLog.log(
        `TabsScreen [${componentNodeHandle.current}] onWillAppear received`,
      );
      onWillAppear?.(event);
    },
    [onWillAppear],
  );

  const onDidAppearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      RNSLog.log(
        `TabsScreen [${componentNodeHandle.current}] onDidAppear received`,
      );
      onDidAppear?.(event);
    },
    [onDidAppear],
  );

  const onWillDisappearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      RNSLog.log(
        `TabsScreen [${componentNodeHandle.current}] onWillDisappear received`,
      );
      onWillDisappear?.(event);
    },
    [onWillDisappear],
  );

  const onDidDisappearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      RNSLog.log(
        `TabsScreen [${componentNodeHandle.current}] onDidDisappear received`,
      );
      onDidDisappear?.(event);
    },
    [onDidDisappear],
  );

  RNSLog.log(
    `TabsScreen [${
      componentNodeHandle.current ?? -1
    }] render; screenKey: ${screenKey}`,
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
