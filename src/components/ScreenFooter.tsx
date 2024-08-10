import React from 'react';
import { Platform, View, ViewProps } from 'react-native';
import ScreenFooterNativeComponent from '../fabric/ScreenFooterNativeComponent';

/**
 * Unstable API
 */
export const NativeScreenFooter: React.ComponentType<ViewProps> =
  Platform.OS !== 'web' ? (ScreenFooterNativeComponent as any) : View;

/**
 * Unstable API
 */
function ScreenFooter(props: ViewProps) {
  return <NativeScreenFooter {...props} />;
}

export default ScreenFooter;
