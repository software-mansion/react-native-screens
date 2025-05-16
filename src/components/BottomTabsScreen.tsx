'use client';

import React from 'react';
import BottomTabsScreenNativeComponent from '../fabric/BottomTabScreenNativeComponent';
import {
  ColorValue,
  StyleSheet,
  View,
  ViewProps,
  findNodeHandle,
} from 'react-native';
import { Freeze } from 'react-freeze';
import { freezeEnabled } from '../core';

export interface BottomTabsScreenProps {
  children: ViewProps['children'];
  isFocused?: boolean;
  badgeValue?: string;
  badgeColor?: ColorValue;
}

// const LIFECYCLE_STATE_INITIAL = 0;
// const LIFECYCLE_STATE_CREATED = 1;
// const LIFECYCLE_STATE_INITIALIZED = 2;
// const LIFECYCLE_STATE_RESUMED = 3;

function BottomTabsScreen(props: BottomTabsScreenProps) {
  const [nativeViewHasDisappeared, setNativeViewHasDisappeared] =
    React.useState(true);

  const isFocused = props.isFocused ?? false;

  const shouldFreeze =
    freezeEnabled() && !isFocused && nativeViewHasDisappeared;

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

  const onWillAppearCallback = React.useCallback(() => {
    console.log(
      `TabsScreen [${componentNodeHandle.current}] onWillAppear received`,
    );
    setNativeViewHasDisappeared(false);
  }, []);

  const onDidAppearCallback = React.useCallback(() => {
    console.log(
      `TabsScreen [${componentNodeHandle.current}] onDidAppear received`,
    );
  }, []);

  const onWillDisappearCallback = React.useCallback(() => {
    console.log(
      `TabsScreen [${componentNodeHandle.current}] onWillDisappear received`,
    );
  }, []);

  const onDidDisappearCallback = React.useCallback(() => {
    console.log(
      `TabsScreen [${componentNodeHandle.current}] onDidDisappear received`,
    );
    setNativeViewHasDisappeared(true);
  }, []);

  console.info(
    `TabsScreen [${
      componentNodeHandle.current ?? -1
    }] render; shouldFreeze: ${shouldFreeze}, nativeViewHasDisappeared: ${nativeViewHasDisappeared}`,
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
      {...props}>
      <Freeze freeze={shouldFreeze}>{props.children}</Freeze>
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
