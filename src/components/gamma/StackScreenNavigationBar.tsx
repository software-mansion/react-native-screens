import React from 'react';
import type { ViewProps } from 'react-native';
import StackScreenNavigationBarNativeComponent, {NativeProps} from '../../fabric/gamma/ScreenStackNavigationBarNativeComponent';

export type ScreenStackNavigationNativeProps = NativeProps & {
  // Overrides
}

type ScreenStackNavigationBarProps = {
  children?: ViewProps['children'];
} & ScreenStackNavigationNativeProps;

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
