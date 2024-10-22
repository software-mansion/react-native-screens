'use client';

import { Platform, View } from 'react-native';
import React from 'react';
import { ScreenContainerProps } from '../types';
import { isNativePlatformSupported, screensEnabled } from '../core';

// Native components
import ScreenContainerNativeComponent from '../fabric/ScreenContainerNativeComponent';
import ScreenNavigationContainerNativeComponent from '../fabric/ScreenNavigationContainerNativeComponent';

function ScreenContainer(props: ScreenContainerProps) {
  const { enabled = screensEnabled(), hasTwoStates, ...rest } = props;

  if (enabled && isNativePlatformSupported) {
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
