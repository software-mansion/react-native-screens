import React from 'react';
import { Platform, View, ViewProps } from 'react-native';
import ScreenContentWrapperNativeComponent from '../fabric/ScreenContentWrapperNativeComponent';

export const NativeScreenContentWrapper: React.ComponentType<ViewProps> =
  Platform.OS !== 'web' ? (ScreenContentWrapperNativeComponent as any) : View;

function ScreenContentWrapper(props: ViewProps) {
  return <NativeScreenContentWrapper collapsable={false} {...props} />;
}

export default ScreenContentWrapper;
