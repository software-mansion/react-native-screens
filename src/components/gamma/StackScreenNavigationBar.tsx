import React from 'react';
import type { ViewProps } from 'react-native';
import StackScreenNavigationBarNativeComponent, {NativeProps} from '../../fabric/gamma/ScreenStackNavigationBarNativeComponent';

export type ScreenStackNavigationBarNativeProps = NativeProps & {
  // Overrides
}

type ScreenStackNavigationBarProps = {
  children?: ViewProps['children'];
} & ScreenStackNavigationBarNativeProps;

function ScreenStackNavigationBar({
  children,
  ...props
}: ScreenStackNavigationBarProps) {
  return (
    <StackScreenNavigationBarNativeComponent {...props}>
      {children}
    </StackScreenNavigationBarNativeComponent>
  );
}

export default ScreenStackNavigationBar;
