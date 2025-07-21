'use client';

import React from 'react';
import BottomTabsNativeComponent, {
  type BlurEffect,
  type TabBarMinimizeBehavior,
  type NativeFocusChangeEvent,
  type TabBarItemLabelVisibilityMode,
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

  /**
   * A callback that gets invoked when user requests change of focused tab screen.
   *
   * @platform android, ios
   */
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
  tabBarItemActiveIndicatorColor?: ColorValue;
  tabBarItemActiveIndicatorEnabled?: boolean;
  tabBarItemRippleColor?: ColorValue;
  tabBarItemLabelVisibilityMode?: TabBarItemLabelVisibilityMode;

  // iOS-only appearance

  /**
   * The color used for selected tab's text and icon color.
   * Starting from iOS 26, it also impacts glow of Liquid Glass tab
   * selection view.
   *
   * tabBarItemTitleFontColor and tabBarItemIconColor defined on
   * BottomTabsScreen component override this color.
   *
   * @platform ios
   */
  tabBarTintColor?: ColorValue;
  tabBarMinimizeBehavior?: TabBarMinimizeBehavior;

  // Control

  // Experimental support

  /**
   * Experimental prop for changing container control.
   *
   * If set to true, tab screen changes need to be handled by JS using
   * onNativeFocusChange callback (controlled/programatically-driven).
   *
   * If set to false, tab screen change will not be prevented by the
   * native side (managed/natively-driven).
   *
   * On iOS, some features are not fully implemented for managed tabs
   * (e.g. overrideScrollViewContentInsetAdjustmentBehavior).
   *
   * On Android, only controlled tabs are currently supported.
   *
   * @default Defaults to `false`.
   *
   * @platform android, ios
   */
  experimentalControlNavigationStateInJS?: boolean;
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
