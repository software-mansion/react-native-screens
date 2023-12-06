import React, { PropsWithChildren, ReactNode } from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';

// Native components
import FullWindowOverlayNativeComponent from '../fabric/FullWindowOverlayNativeComponent';
const NativeFullWindowOverlay: React.ComponentType<
  PropsWithChildren<{
    style: StyleProp<ViewStyle>;
  }>
> = FullWindowOverlayNativeComponent as any;

const FullWindowOverlay = (props: { children: ReactNode }) => {
  if (Platform.OS !== 'ios') {
    console.warn('Importing FullWindowOverlay is only valid on iOS devices.');
    return <View {...props} />;
  }
  return (
    <NativeFullWindowOverlay
      style={{ position: 'absolute', width: '100%', height: '100%' }}>
      {props.children}
    </NativeFullWindowOverlay>
  );
};

export default Platform.OS !== 'web'
  ? FullWindowOverlay
  : (View as React.ComponentType<{
      children: ReactNode;
    }>);
