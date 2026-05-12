'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ColorValue, ViewProps } from 'react-native';

// #region General helpers

type TabSelectedEvent = {
  selectedScreenKey: string;
  provenance: CT.Int32;
  isRepeated: boolean;
  hasTriggeredSpecialEffect: boolean;
  actionOrigin: 'user' | 'programmatic-js' | 'programmatic-native' | 'implicit';
};

type NavigationStateRequest = {
  selectedScreenKey: string;
  baseProvenance: CT.Int32;
};

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

type TabsHostColorScheme = 'inherit' | 'light' | 'dark';

// #endregion General helpers

// #region Android-specific helpers
// No helpers specified so far, but marking the place where these should land.
// #endregion Android-specific helpers

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

  // General
  tabBarHidden?: CT.WithDefault<boolean, false>;
  nativeContainerBackgroundColor?: ColorValue | undefined;
  colorScheme?: CT.WithDefault<TabsHostColorScheme, 'inherit'>;

  // Android-specific props
  tabBarRespectsIMEInsets?: CT.WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('RNSTabsHostAndroid', {
  interfaceOnly: true,
  excludedPlatforms: ['iOS'],
});
