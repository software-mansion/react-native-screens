'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ColorValue, ViewProps } from 'react-native';

// #region General helpers

type TabSelectedEvent = {
  selectedScreenKey: string;
  provenance: CT.Int32;
  isRepeated: boolean;
  hasTriggeredSpecialEffect: boolean;
  isNativeAction: boolean;
};

type NavigationState = {
  selectedScreenKey: string;
  provenance: CT.Int32;
};

type TabSelectionRejectedEvent = Readonly<{
  selectedScreenKey: string;
  provenance: CT.Int32;
  rejectedScreenKey: string;
  rejectedProvenance: CT.Int32;
}>;

type TabsHostColorScheme = 'inherit' | 'light' | 'dark';

// #endregion General helpers

// #region Android-specific helpers
// No helpers specified so far, but marking the place where these should land.
// #endregion Android-specific helpers

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

  // Android-specific props
  tabBarRespectsIMEInsets?: CT.WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('RNSTabsHostAndroid', {
  interfaceOnly: true,
  excludedPlatforms: ['iOS'],
});
