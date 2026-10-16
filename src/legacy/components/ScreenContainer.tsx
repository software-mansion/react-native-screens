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
 * Gated on `enabled` and on `nativeScreensAvailable()` together, which is the
 * same pair `Screen` uses. So the platform half of the decision is the same
 * answer in both. The `enabled` half is a prop: a caller that passes different
 * values to a container and to the screens inside it gets different
 * implementations, and keeping those in step is the caller's.
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
