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
import type { NativeProps } from '../fabric/FullWindowOverlayNativeComponent';

const NativeFullWindowOverlay: React.ComponentType<
  PropsWithChildren<{
    style: StyleProp<ViewStyle>;
  }> &
    NativeProps
> = FullWindowOverlayNativeComponent as any;

type FullWindowOverlayProps = {
  children: ReactNode;
  unstable_accessibilityContainerViewIsModal?: boolean;
};

function FullWindowOverlay(props: FullWindowOverlayProps) {
  const { width, height } = useWindowDimensions();
  if (Platform.OS !== 'ios') {
    console.warn('Using FullWindowOverlay is only valid on iOS devices.');
    return <View {...props} />;
  }
  return (
    <NativeFullWindowOverlay
      style={[StyleSheet.absoluteFill, { width, height }]}
      accessibilityContainerViewIsModal={
        props.unstable_accessibilityContainerViewIsModal
      }>
      {props.children}
    </NativeFullWindowOverlay>
  );
}

export default FullWindowOverlay;
