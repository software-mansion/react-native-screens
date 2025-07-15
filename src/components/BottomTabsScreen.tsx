'use client';

import React from 'react';
import BottomTabsScreenNativeComponent, {
  BlurEffect,
  type NativeProps,
} from '../fabric/BottomTabsScreenNativeComponent';
import {
  type ColorValue,
  type NativeSyntheticEvent,
  StyleSheet,
  TextStyle,
  type ViewProps,
  findNodeHandle,
} from 'react-native';
import { Freeze } from 'react-freeze';
import { freezeEnabled } from '../core';
import { featureFlags } from '../flags';

export type EmptyObject = Record<string, never>;
export type BottomTabsScreenEventHandler<T> = (
  event: NativeSyntheticEvent<T>,
) => void;

export interface BottomTabsScreenProps {
  children?: ViewProps['children'];
  placeholder?: React.ReactNode | undefined;

  // Control

  // Works only in 'controlled' mode. Otherwise this prop indicates only initally selected tab.
  isFocused?: boolean;
  tabKey: string;

  // Tab Bar Appearance
  // tabBarAppearance?: TabBarAppearance; // Does not work due to codegen issue.
  tabBarBackgroundColor?: ColorValue;
  tabBarBlurEffect?: BlurEffect; // defaults to 'none'

  tabBarItemTitleFontFamily?: TextStyle['fontFamily'];
  tabBarItemTitleFontSize?: TextStyle['fontSize'];
  tabBarItemTitleFontWeight?: TextStyle['fontWeight'];
  tabBarItemTitleFontStyle?: TextStyle['fontStyle'];
  tabBarItemTitleFontColor?: TextStyle['color'];
  tabBarItemTitlePositionAdjustment?: {
    horizontal?: number;
    vertical?: number;
  };

  tabBarItemIconColor?: ColorValue;

  tabBarItemBadgeBackgroundColor?: ColorValue;

  // General
  title?: string;

  iconSFSymbolName?: string;
  selectedIconSFSymbolName?: string;

  // Android specific
  iconResourceName?: string;

  badgeValue?: string;

  specialEffects?: {
    repeatedTabSelection?: {
      popToRoot?: boolean;
      scrollToTop?: boolean;
    };
  };

  overrideScrollViewContentInsetAdjustmentBehavior?: boolean; // defaults to true

  // Events
  onWillAppear?: BottomTabsScreenEventHandler<EmptyObject>;
  onDidAppear?: BottomTabsScreenEventHandler<EmptyObject>;
  onWillDisappear?: BottomTabsScreenEventHandler<EmptyObject>;
  onDidDisappear?: BottomTabsScreenEventHandler<EmptyObject>;
}

function BottomTabsScreen(props: BottomTabsScreenProps) {
  const componentNodeRef = React.useRef<React.Component<NativeProps>>(null);
  const componentNodeHandle = React.useRef<number>(-1);

  React.useEffect(() => {
    if (componentNodeRef.current != null) {
      componentNodeHandle.current =
        findNodeHandle(componentNodeRef.current) ?? -1;
    } else {
      componentNodeHandle.current = -1;
    }
  }, []);

  const [nativeViewIsVisible, setNativeViewIsVisible] = React.useState(false);

  const {
    onWillAppear,
    onDidAppear,
    onWillDisappear,
    onDidDisappear,
    isFocused = false,
    ...propsWoEventHandlers
  } = props;

  let shouldFreeze = freezeEnabled();

  if (featureFlags.experiment.controlledBottomTabs) {
    // If the tabs are JS controlled, we want to freeze only when given view is not focused && it is not currently visible
    shouldFreeze = shouldFreeze && !nativeViewIsVisible && !isFocused;
  } else {
    shouldFreeze = shouldFreeze && !nativeViewIsVisible;
  }

  const onWillAppearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      console.log(
        `TabsScreen [${componentNodeHandle.current}] onWillAppear received`,
      );
      setNativeViewIsVisible(true);
      onWillAppear?.(event);
    },
    [onWillAppear],
  );

  const onDidAppearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      console.log(
        `TabsScreen [${componentNodeHandle.current}] onDidAppear received`,
      );
      onDidAppear?.(event);
    },
    [onDidAppear],
  );

  const onWillDisappearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      console.log(
        `TabsScreen [${componentNodeHandle.current}] onWillDisappear received`,
      );
      onWillDisappear?.(event);
    },
    [onWillDisappear],
  );

  const onDidDisappearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      console.log(
        `TabsScreen [${componentNodeHandle.current}] onDidDisappear received`,
      );
      setNativeViewIsVisible(false);
      onDidDisappear?.(event);
    },
    [onDidDisappear],
  );

  console.info(
    `TabsScreen [${componentNodeHandle.current ?? -1}] render; tabKey: ${
      propsWoEventHandlers.tabKey
    } shouldFreeze: ${shouldFreeze}, isFocused: ${isFocused} nativeViewIsVisible: ${nativeViewIsVisible}`,
  );

  return (
    <BottomTabsScreenNativeComponent
      collapsable={false}
      style={styles.fillParent}
      onWillAppear={onWillAppearCallback}
      onDidAppear={onDidAppearCallback}
      onWillDisappear={onWillDisappearCallback}
      onDidDisappear={onDidDisappearCallback}
      isFocused={isFocused}
      // @ts-ignore - This is debug only anyway
      ref={componentNodeRef}
      {...propsWoEventHandlers}>
      <Freeze
        freeze={shouldFreeze}
        placeholder={propsWoEventHandlers.placeholder}>
        {propsWoEventHandlers.children}
      </Freeze>
    </BottomTabsScreenNativeComponent>
  );
}

export default BottomTabsScreen;

const styles = StyleSheet.create({
  fillParent: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
