'use client';

import React from 'react';
import BottomTabsScreenNativeComponent, {
  type TabBarItemAppearance,
} from '../fabric/BottomTabsScreenNativeComponent';
import {
  ColorValue,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  ViewProps,
  findNodeHandle,
} from 'react-native';
import { Freeze } from 'react-freeze';
import { freezeEnabled } from '../core';

export type EmptyObject = Record<string, never>;
export type BottomTabsScreenEventHandler<T> = (
  event: NativeSyntheticEvent<T>,
) => void;

export interface BottomTabsScreenProps {
  children: ViewProps['children'];
  placeholder?: React.ReactNode | undefined;
  isFocused?: boolean;
  badgeValue?: string;
  badgeColor?: ColorValue;
  title?: string;
  tabBarItemAppearance?: TabBarItemAppearance;

  // Events
  onWillAppear?: BottomTabsScreenEventHandler<EmptyObject>;
  onDidAppear?: BottomTabsScreenEventHandler<EmptyObject>;
  onWillDisappear?: BottomTabsScreenEventHandler<EmptyObject>;
  onDidDisappear?: BottomTabsScreenEventHandler<EmptyObject>;
}

function BottomTabsScreen(props: BottomTabsScreenProps) {
  const [nativeViewHasDisappeared, setNativeViewHasDisappeared] =
    React.useState(true);

  const isFocused = props.isFocused ?? false;

  const shouldFreeze =
    freezeEnabled() && !isFocused && nativeViewHasDisappeared;

  const {
    onWillAppear,
    onWillDisappear,
    onDidAppear,
    onDidDisappear,
    ...propsWoEventHandlers
  } = props;

  const componentNodeRef = React.useRef<View>(null);
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
      console.log(
        `TabsScreen [${componentNodeHandle.current}] onWillAppear received`,
      );
      setNativeViewHasDisappeared(false);
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
      setNativeViewHasDisappeared(true);
      onDidDisappear?.(event);
    },
    [onDidDisappear],
  );

  console.info(
    `TabsScreen [${
      componentNodeHandle.current ?? -1
    }] render; shouldFreeze: ${shouldFreeze}, isFocused: ${isFocused} nativeViewHasDisappeared: ${nativeViewHasDisappeared}`,
  );

  return (
    <BottomTabsScreenNativeComponent
      collapsable={false}
      style={styles.fillParent}
      onWillAppear={onWillAppearCallback}
      onDidAppear={onDidAppearCallback}
      onWillDisappear={onWillDisappearCallback}
      onDidDisappear={onDidDisappearCallback}
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
