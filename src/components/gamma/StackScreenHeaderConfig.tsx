import React from 'react';
import type { ViewProps } from 'react-native';
import StackScreenHeaderConfigNativeComponent, {NativeProps} from '../../fabric/gamma/StackScreenHeaderConfigNativeComponent';

export type StackScreenHeaderConfigNativeProps = NativeProps & {
  // Overrides
}

type StackScreenHeaderConfigProps = {
  children?: ViewProps['children'];
} & StackScreenHeaderConfigNativeProps;

function StackScreenHeaderConfig({
  children,
  ...props
}: StackScreenHeaderConfigProps) {
  return (
    <StackScreenHeaderConfigNativeComponent {...props}>
      {children}
    </StackScreenHeaderConfigNativeComponent>
  );
}

export default StackScreenHeaderConfig;
