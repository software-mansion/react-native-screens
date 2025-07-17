'use client';

import React from 'react';
import BottomTabsNativeComponent, {
  BlurEffect,
  NativeFocusChangeEvent,
  type NativeProps as BottomTabsNativeComponentProps,
} from '../fabric/BottomTabsNativeComponent';
import {
  type ColorValue,
  findNodeHandle,
  type NativeSyntheticEvent,
  StyleSheet,
  TextStyle,
  type ViewProps,
} from 'react-native';
import featureFlags from '../flags';

export interface BottomTabsProps extends ViewProps {
  // Events
  onNativeFocusChange?: (
    event: NativeSyntheticEvent<NativeFocusChangeEvent>,
  ) => void;

  // Tab Bar Appearance
  // tabBarAppearance?: TabBarAppearance; // Does not work due to codegen issue.
  tabBarBackgroundColor?: ColorValue;
  tabBarBlurEffect?: BlurEffect; // defaults to 'none'
  tabBarTintColor?: ColorValue;

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

  // Additional for Android
  tabBarItemTitleFontSizeActive?: TextStyle['fontSize'];
  tabBarItemTitleFontColorActive?: TextStyle['color'];
  tabBarItemIconColorActive?: ColorValue;

  // Control

  // Experimental support
  experimentalControlNavigationStateInJS?: boolean; // defaults to `false`
}

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function BottomTabs(props: BottomTabsProps) {
  console.info(`BottomTabs render`);

  const {
    onNativeFocusChange,
    experimentalControlNavigationStateInJS = featureFlags.experiment
      .controlledBottomTabs,
    ...filteredProps
  } = props;

  const componentNodeRef =
    React.useRef<React.Component<BottomTabsNativeComponentProps>>(null);
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
      console.log(
        `BottomTabs [${
          componentNodeHandle.current ?? -1
        }] onNativeFocusChange: ${JSON.stringify(event.nativeEvent)}`,
      );
      onNativeFocusChange?.(event);
    },
    [onNativeFocusChange],
  );

  return (
    <BottomTabsNativeComponent
      style={styles.fillParent}
      onNativeFocusChange={onNativeFocusChangeCallback}
      controlNavigationStateInJS={experimentalControlNavigationStateInJS}
      // @ts-ignore suppress ref - debug only
      ref={componentNodeRef}
      {...filteredProps}>
      {filteredProps.children}
    </BottomTabsNativeComponent>
  );
}

export default BottomTabs;

const styles = StyleSheet.create({
  fillParent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
