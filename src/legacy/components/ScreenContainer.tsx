'use client';

import { Platform, View } from 'react-native';
import React from 'react';
import { ScreenContainerProps } from '../types';
import { nativeScreensAvailable, screensEnabled } from '../../core';

// Native components
import ScreenContainerNativeComponent from '../../fabric/legacy/ScreenContainerNativeComponent';
import ScreenNavigationContainerNativeComponent from '../../fabric/legacy/ScreenNavigationContainerNativeComponent';

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
