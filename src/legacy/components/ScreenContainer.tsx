'use client';

import { Platform, View } from 'react-native';
import React from 'react';
import { ScreenContainerProps } from '../types';
import { nativeScreensAvailable, screensEnabled } from '../../core';

// Native components
import ScreenContainerNativeComponent from '../../fabric/legacy/ScreenContainerNativeComponent';
import ScreenNavigationContainerNativeComponent from '../../fabric/legacy/ScreenNavigationContainerNativeComponent';

/**
 * Holds screens, natively where that is possible and as a view where it is not.
 *
 * Gated the same way as `Screen`, on `enabled` and on
 * `nativeScreensAvailable()` together, so that the two cannot disagree about
 * which implementation a tree is using.
 */
function ScreenContainer(props: ScreenContainerProps) {
  const { enabled = screensEnabled(), hasTwoStates, ...rest } = props;

  if (enabled && nativeScreensAvailable()) {
    if (hasTwoStates) {
      const ScreenNavigationContainer =
        Platform.OS === 'ios'
          ? ScreenNavigationContainerNativeComponent
          : ScreenContainerNativeComponent;
      return <ScreenNavigationContainer {...rest} />;
    }
    return <ScreenContainerNativeComponent {...rest} />;
  }
  return <View {...rest} />;
}

export default ScreenContainer;
