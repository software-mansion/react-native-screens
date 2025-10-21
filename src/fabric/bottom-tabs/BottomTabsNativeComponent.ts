'use client';

// eslint-disable-next-line @react-native/no-deep-imports
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

type NativeFocusChangeEvent = {
  tabKey: string;
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
  onNativeFocusChange?: DirectEventHandler<NativeFocusChangeEvent>;

  // Appearance
  // tabBarAppearance?: TabBarAppearance; // Does not work due to codegen issue.

  // Android-specific
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
  tabBarItemActiveIndicatorColor?: ColorValue;
  tabBarItemActiveIndicatorEnabled?: WithDefault<boolean, true>;
  tabBarItemRippleColor?: ColorValue;
  tabBarItemLabelVisibilityMode?: WithDefault<
    TabBarItemLabelVisibilityMode,
    'auto'
  >;

  // iOS-specific
  tabBarTintColor?: ColorValue;
  tabBarMinimizeBehavior?: WithDefault<TabBarMinimizeBehavior, 'automatic'>;
  tabBarControllerMode?: WithDefault<TabBarControllerMode, 'automatic'>;

  // Control

  // Experimental support
  controlNavigationStateInJS?: WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('RNSBottomTabs', {
  interfaceOnly: true,
});
