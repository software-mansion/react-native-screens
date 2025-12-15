'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ColorValue, ViewProps } from 'react-native';

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

type TabBarItemLabelVisibilityMode =
  | 'auto'
  | 'selected'
  | 'labeled'
  | 'unlabeled';

type TabBarMinimizeBehavior =
  | 'automatic'
  | 'never'
  | 'onScrollDown'
  | 'onScrollUp';

type TabBarControllerMode = 'automatic' | 'tabBar' | 'tabSidebar';

export interface NativeProps extends ViewProps {
  // Events
  onNativeFocusChange?: CT.DirectEventHandler<NativeFocusChangeEvent>;

  // General
  tabBarHidden?: CT.WithDefault<boolean, false>;
  nativeContainerBackgroundColor?: ColorValue;

  // Appearance
  // tabBarAppearance?: TabBarAppearance; // Does not work due to codegen issue.

  // Android-specific
  tabBarBackgroundColor?: ColorValue;
  tabBarItemTitleFontFamily?: string;
  tabBarItemTitleFontSize?: CT.Float;
  tabBarItemTitleFontSizeActive?: CT.Float;
  tabBarItemTitleFontWeight?: string;
  tabBarItemTitleFontStyle?: string;
  tabBarItemTitleFontColor?: ColorValue;
  tabBarItemTitleFontColorActive?: ColorValue;
  tabBarItemIconColor?: ColorValue;
  tabBarItemIconColorActive?: ColorValue;
  tabBarItemActiveIndicatorColor?: ColorValue;
  tabBarItemActiveIndicatorEnabled?: CT.WithDefault<boolean, true>;
  tabBarItemRippleColor?: ColorValue;
  tabBarItemLabelVisibilityMode?: CT.WithDefault<
    TabBarItemLabelVisibilityMode,
    'auto'
  >;

  // iOS-specific
  tabBarTintColor?: ColorValue;
  tabBarMinimizeBehavior?: CT.WithDefault<TabBarMinimizeBehavior, 'automatic'>;
  tabBarControllerMode?: CT.WithDefault<TabBarControllerMode, 'automatic'>;

  // Control

  // Experimental support
  controlNavigationStateInJS?: CT.WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('RNSBottomTabs', {
  interfaceOnly: true,
});
