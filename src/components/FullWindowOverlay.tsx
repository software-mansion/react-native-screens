import React, { PropsWithChildren, ReactNode } from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';

// Native components
import FullWindowOverlayNativeComponent from '../fabric/FullWindowOverlayNativeComponent';
const NativeFullWindowOverlay: React.ComponentType<
  PropsWithChildren<{
    style: StyleProp<ViewStyle>;
  }>
> = FullWindowOverlayNativeComponent as any;

function FullWindowOverlay(props: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  if (Platform.OS !== 'ios') {
    console.warn('Using FullWindowOverlay is only valid on iOS devices.');
    return <View {...props} />;
  }
  return (
    <NativeFullWindowOverlay
      style={[StyleSheet.absoluteFill, { width, height }]}>
      {props.children}
    </NativeFullWindowOverlay>
  );
}

export default FullWindowOverlay;
