'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ColorValue, ViewProps } from 'react-native';

// #region General helpers

type TabSelectedEvent = Readonly<{
  selectedScreenKey: string;
  provenance: CT.Int32;
  isRepeated: boolean;
  hasTriggeredSpecialEffect: boolean;
  isNativeAction: boolean;
}>;

type NavigationState = Readonly<{
  selectedScreenKey: string;
  provenance: CT.Int32;
}>;

type TabSelectionRejectedEvent = Readonly<{
  selectedScreenKey: string;
  provenance: CT.Int32;
  rejectedScreenKey: string;
  rejectedProvenance: CT.Int32;
  rejectionReason: 'stale' | 'repeated' | 'more-nav-ctrl-not-available';
}>;

type TabsHostColorScheme = 'inherit' | 'light' | 'dark';

type LayoutDirection = 'inherit' | 'ltr' | 'rtl';

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
  // Control
  navState: NavigationState;
  rejectStaleNavStateUpdates?: CT.WithDefault<boolean, false>;

  // Events
  onTabSelected?: CT.DirectEventHandler<TabSelectedEvent>;
  onTabSelectionRejected?: CT.DirectEventHandler<TabSelectionRejectedEvent>;

  // General
  tabBarHidden?: CT.WithDefault<boolean, false>;
  nativeContainerBackgroundColor?: ColorValue;
  colorScheme?: CT.WithDefault<TabsHostColorScheme, 'inherit'>;

  // We can't use `direction` name for this prop as it's also used by
  // direction style View prop.
  layoutDirection?: CT.WithDefault<LayoutDirection, 'inherit'>;

  // Experimental support
  controlNavigationStateInJS?: CT.WithDefault<boolean, false>;

  // iOS-specific props
  tabBarTintColor?: ColorValue;
  tabBarMinimizeBehavior?: CT.WithDefault<TabBarMinimizeBehavior, 'automatic'>;
  tabBarControllerMode?: CT.WithDefault<TabBarControllerMode, 'automatic'>;
}

export default codegenNativeComponent<NativeProps>('RNSTabsHostIOS', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});
