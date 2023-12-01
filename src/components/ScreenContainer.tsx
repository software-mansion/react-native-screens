import { Platform, View } from 'react-native';
import React from 'react';
import { ScreenContainerProps } from '../types';
import { isNativePlatformSupported, screensEnabled } from '../core';

import ScreenContainerNativeComponent from '../fabric/ScreenContainerNativeComponent';
import ScreenNavigationContainerNativeComponent from '../fabric/ScreenNavigationContainerNativeComponent';

export const NativeScreenContainer: React.ComponentType<ScreenContainerProps> =
  ScreenContainerNativeComponent as any;
export const NativeScreenNavigationContainer: React.ComponentType<ScreenContainerProps> =
  ScreenNavigationContainerNativeComponent as any;

const ScreenContainer = (props: ScreenContainerProps) => {
  const { enabled = screensEnabled(), hasTwoStates, ...rest } = props;

  if (enabled && isNativePlatformSupported) {
    if (hasTwoStates) {
      const ScreenNavigationContainer =
        Platform.OS === 'ios'
          ? NativeScreenNavigationContainer
          : NativeScreenContainer;
      return <ScreenNavigationContainer {...rest} />;
    }
    return <NativeScreenContainer {...rest} />;
  }
  return <View {...rest} />;
};

export default ScreenContainer;
