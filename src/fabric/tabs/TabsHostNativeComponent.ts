'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ColorValue, ViewProps } from 'react-native';

type NativeFocusChangeEvent = {
  tabKey: string;
  repeatedSelectionHandledBySpecialEffect: boolean;
};

type TabBarMinimizeBehavior =
  | 'automatic'
  | 'never'
  | 'onScrollDown'
  | 'onScrollUp';

type TabBarControllerMode = 'automatic' | 'tabBar' | 'tabSidebar';

type LayoutDirection = 'inherit' | 'ltr' | 'rtl';

type TabsHostColorScheme = 'inherit' | 'light' | 'dark';

export interface NativeProps extends ViewProps {
  // Events
  onNativeFocusChange?: CT.DirectEventHandler<NativeFocusChangeEvent>;

  // General
  tabBarHidden?: CT.WithDefault<boolean, false>;
  nativeContainerBackgroundColor?: ColorValue;

  // We can't use `direction` name for this prop as it's also used by
  // direction style View prop.
  layoutDirection?: CT.WithDefault<LayoutDirection, 'inherit'>;

  // iOS-specific
  tabBarTintColor?: ColorValue;
  tabBarMinimizeBehavior?: CT.WithDefault<TabBarMinimizeBehavior, 'automatic'>;
  tabBarControllerMode?: CT.WithDefault<TabBarControllerMode, 'automatic'>;
  colorScheme?: CT.WithDefault<TabsHostColorScheme, 'inherit'>;

  // Control

  // Experimental support
  controlNavigationStateInJS?: CT.WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('RNSTabsHost', {
  interfaceOnly: true,
});
