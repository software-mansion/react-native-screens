'use client';

import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ColorValue, ViewProps } from 'react-native';
import type {
  DirectEventHandler,
  Float,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';

// TODO: Report issue on RN repo, that nesting color value inside a struct does not work.
// Generated code is ok, but the value is not passed down correctly - whatever color is set
// host component receives RGBA(0, 0, 0, 0) anyway.
// type TabBarAppearance = {
//   backgroundColor?: ColorValue;
// };

export type NativeFocusChangeEvent = {
  tabKey: string;
};

export type BlurEffect =
  | 'none'
  | 'systemDefault'
  | 'extraLight'
  | 'light'
  | 'dark'
  | 'regular'
  | 'prominent'
  | 'systemUltraThinMaterial'
  | 'systemThinMaterial'
  | 'systemMaterial'
  | 'systemThickMaterial'
  | 'systemChromeMaterial'
  | 'systemUltraThinMaterialLight'
  | 'systemThinMaterialLight'
  | 'systemMaterialLight'
  | 'systemThickMaterialLight'
  | 'systemChromeMaterialLight'
  | 'systemUltraThinMaterialDark'
  | 'systemThinMaterialDark'
  | 'systemMaterialDark'
  | 'systemThickMaterialDark'
  | 'systemChromeMaterialDark';

export type TabBarItemLabelVisibilityMode =
  | 'auto'
  | 'selected'
  | 'labeled'
  | 'unlabeled';

export type TabBarMinimizeBehavior =
  | 'automatic'
  | 'never'
  | 'onScrollDown'
  | 'onScrollUp';

export interface NativeProps extends ViewProps {
  // Events
  onNativeFocusChange?: DirectEventHandler<NativeFocusChangeEvent>;

  // Appearance
  // tabBarAppearance?: TabBarAppearance; // Does not work due to codegen issue.

  // Android-only appearance
  tabBarBackgroundColor?: ColorValue;

  tabBarItemTitleFontFamily?: string;
  tabBarItemTitleFontSize?: Float;
  tabBarItemTitleFontSizeActive?: Float;
  tabBarItemTitleFontWeight?: string;
  tabBarItemTitleFontStyle?: string;
  tabBarItemTitleFontColor?: ColorValue;
  tabBarItemTitleFontColorActive?: ColorValue;

  tabBarItemIconColor?: ColorValue;
  tabBarItemIconColorActive?: ColorValue;
  tabBarItemActivityIndicatorColor?: ColorValue;
  tabBarItemRippleColor?: ColorValue;
  tabBarItemLabelVisibilityMode?: WithDefault<
    TabBarItemLabelVisibilityMode,
    'auto'
  >;

  // iOS-only appearance
  tabBarTintColor?: ColorValue;
  tabBarMinimizeBehavior?: WithDefault<TabBarMinimizeBehavior, 'automatic'>;

  // Control

  // Experimental support
  controlNavigationStateInJS?: WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('RNSBottomTabs', {
  interfaceOnly: true,
});
