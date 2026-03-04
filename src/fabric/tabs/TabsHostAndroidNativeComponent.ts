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

// #region Android-specific helpers
// No helpers specified so far, but marking the place where these should land.
// #endregion Android-specific helpers

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
}

export default codegenNativeComponent<NativeProps>('RNSTabsHostAndroid', {
  interfaceOnly: true,
  excludedPlatforms: ['iOS'],
});
