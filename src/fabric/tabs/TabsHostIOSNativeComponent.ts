'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ColorValue, ViewProps } from 'react-native';

// #region General helpers

type NativeFocusChangeEvent = {
  tabKey: string;
  repeatedSelectionHandledBySpecialEffect: boolean;
};

type LayoutDirection = 'inherit' | 'ltr' | 'rtl';

// #endregion General helpers

// #region iOS-specific helpers

type TabBarMinimizeBehavior =
  | 'automatic'
  | 'never'
  | 'onScrollDown'
  | 'onScrollUp';

type TabBarControllerMode = 'automatic' | 'tabBar' | 'tabSidebar';

type TabsHostColorScheme = 'inherit' | 'light' | 'dark';

// #endregion iOS-specific helpers

export interface NativeProps extends ViewProps {
  // Events
  onNativeFocusChange?: CT.DirectEventHandler<NativeFocusChangeEvent>;

  // General
  tabBarHidden?: CT.WithDefault<boolean, false>;
  nativeContainerBackgroundColor?: ColorValue;

  // We can't use `direction` name for this prop as it's also used by
  // direction style View prop.
  layoutDirection?: CT.WithDefault<LayoutDirection, 'inherit'>;

  // Control

  // Experimental support
  controlNavigationStateInJS?: CT.WithDefault<boolean, false>;

  // iOS-specific props
  tabBarTintColor?: ColorValue;
  tabBarMinimizeBehavior?: CT.WithDefault<TabBarMinimizeBehavior, 'automatic'>;
  tabBarControllerMode?: CT.WithDefault<TabBarControllerMode, 'automatic'>;
  colorScheme?: CT.WithDefault<TabsHostColorScheme, 'inherit'>;
}

export default codegenNativeComponent<NativeProps>('RNSTabsHostIOS', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});
