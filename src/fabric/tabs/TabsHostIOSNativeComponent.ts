'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ColorValue, ViewProps } from 'react-native';

// #region General helpers

type TabSelectedEvent = Readonly<{
  selectedScreenKey: string;
  provenance: CT.Int32;
  isRepeated: boolean;
  hasTriggeredSpecialEffect: boolean;
  actionOrigin: 'user' | 'programmatic-js' | 'programmatic-native' | 'implicit';
}>;

type NavigationStateRequest = Readonly<{
  selectedScreenKey: string;
  baseProvenance: CT.Int32;
}>;

type TabSelectionRejectedEvent = Readonly<{
  selectedScreenKey: string;
  provenance: CT.Int32;
  rejectedScreenKey: string;
  rejectedBaseProvenance: CT.Int32;
  rejectionReason: 'stale' | 'repeated';
}>;

type TabSelectionPreventedEvent = Readonly<{
  selectedScreenKey: string;
  provenance: CT.Int32;
  preventedScreenKey: string;
}>;

type MoreTabSelectedEvent = Readonly<{
  selectedScreenKey: string;
  provenance: CT.Int32;
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
  navStateRequest: NavigationStateRequest;
  rejectStaleNavStateUpdates?: CT.WithDefault<boolean, false>;

  // Events
  onTabSelected?: CT.DirectEventHandler<TabSelectedEvent> | undefined;
  onTabSelectionRejected?:
    | CT.DirectEventHandler<TabSelectionRejectedEvent>
    | undefined;
  onTabSelectionPrevented?:
    | CT.DirectEventHandler<TabSelectionPreventedEvent>
    | undefined;
  onMoreTabSelected?: CT.DirectEventHandler<MoreTabSelectedEvent> | undefined;

  // General
  tabBarHidden?: CT.WithDefault<boolean, false>;
  nativeContainerBackgroundColor?: ColorValue | undefined;
  colorScheme?: CT.WithDefault<TabsHostColorScheme, 'inherit'>;

  // We can't use `direction` name for this prop as it's also used by
  // direction style View prop.
  layoutDirection?: CT.WithDefault<LayoutDirection, 'inherit'>;

  // iOS-specific props
  tabBarTintColor?: ColorValue | undefined;
  tabBarMinimizeBehavior?: CT.WithDefault<TabBarMinimizeBehavior, 'automatic'>;
  tabBarControllerMode?: CT.WithDefault<TabBarControllerMode, 'automatic'>;
}

export default codegenNativeComponent<NativeProps>('RNSTabsHostIOS', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});
