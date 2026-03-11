'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ColorValue, ViewProps } from 'react-native';

// #region General helpers

type NativeFocusChangeEvent = {
  screenKey: string;
  repeatedSelectionHandledBySpecialEffect: boolean;
};

type TabsHostColorScheme = 'inherit' | 'light' | 'dark';

// #endregion General helpers

// #region Android-specific helpers
// No helpers specified so far, but marking the place where these should land.
// #endregion Android-specific helpers

export interface NativeProps extends ViewProps {
  // Events
  onNativeFocusChange?: CT.DirectEventHandler<NativeFocusChangeEvent>;

  // General
  tabBarHidden?: CT.WithDefault<boolean, false>;
  nativeContainerBackgroundColor?: ColorValue;
  colorScheme?: CT.WithDefault<TabsHostColorScheme, 'inherit'>;

  // Android-specific props
  // No props specified so far, but marking the place where these should land.
}

export default codegenNativeComponent<NativeProps>('RNSTabsHostAndroid', {
  interfaceOnly: true,
  excludedPlatforms: ['iOS'],
});
