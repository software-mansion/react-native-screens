import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// react-native-gesture-handler is not supported on Windows.
// See https://github.com/software-mansion/react-native-gesture-handler/issues/3723
// Metro resolves this file instead of gesture-handler-interop.ts when bundling for Windows,
// so neither gesture-handler package is included in the Windows bundle.

const GestureHandlerRootView = ({
  children,
}: Readonly<{
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}>): React.JSX.Element => <>{children}</>;

const GestureDetectorProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element => <>{children}</>;

export { GestureHandlerRootView, GestureDetectorProvider };
