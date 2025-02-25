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
import warnOnce from 'warn-once';
const NativeFullWindowOverlay: React.ComponentType<
  PropsWithChildren<{
    style: StyleProp<ViewStyle>;
  }>
> = FullWindowOverlayNativeComponent as any;

function FullWindowOverlay(props: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    console.warn(
      'Using FullWindowOverlay is only valid on iOS & Android devices.',
    );
    return <View {...props} />;
  }

  warnOnce(
    Platform.OS === 'android',
    'Support for FullWindowOverlay on Android is experimental',
  );

  return (
    <NativeFullWindowOverlay
      style={[StyleSheet.absoluteFill, { width, height }]}>
      {props.children}
    </NativeFullWindowOverlay>
  );
}

export default FullWindowOverlay;
