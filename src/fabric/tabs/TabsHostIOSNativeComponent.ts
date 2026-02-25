'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ColorValue, ViewProps } from 'react-native';

// #region General helpers

// TODO: Report issue on RN repo, that nesting color value inside a struct does not work.
// Generated code is ok, but the value is not passed down correctly - whatever color is set
// host component receives RGBA(0, 0, 0, 0) anyway.
// type TabBarAppearance = {
//   backgroundColor?: ColorValue;
// };

type NativeFocusChangeEvent = {
  tabKey: string;
  repeatedSelectionHandledBySpecialEffect: boolean;
};

// #endregion General helpers

// #region iOS-specific helpers

type TabBarMinimizeBehavior =
  | 'automatic'
  | 'never'
  | 'onScrollDown'
  | 'onScrollUp';

type TabBarControllerMode = 'automatic' | 'tabBar' | 'tabSidebar';

// #endregion iOS-specific helpers

export interface NativeProps extends ViewProps {
  // #region Common Props

  // Events
  onNativeFocusChange?: CT.DirectEventHandler<NativeFocusChangeEvent>;

  // General
  tabBarHidden?: CT.WithDefault<boolean, false>;
  nativeContainerBackgroundColor?: ColorValue;

  // Appearance
  // tabBarAppearance?: TabBarAppearance; // Does not work due to codegen issue.

  // Control

  // Experimental support
  controlNavigationStateInJS?: CT.WithDefault<boolean, false>;

  // #endregion Common Props

  // #region iOS-specific Props

  tabBarTintColor?: ColorValue;
  tabBarMinimizeBehavior?: CT.WithDefault<TabBarMinimizeBehavior, 'automatic'>;
  tabBarControllerMode?: CT.WithDefault<TabBarControllerMode, 'automatic'>;

  // #endregion iOS-specific Props
}

export default codegenNativeComponent<NativeProps>('RNSTabsHostIOS', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});
