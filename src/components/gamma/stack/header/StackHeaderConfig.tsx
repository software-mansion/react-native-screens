import React from 'react';
import { StyleSheet } from 'react-native';
import { StackHeaderConfigProps } from './StackHeaderConfig.types';
import StackHeaderConfigNativeComponent from '../../../../fabric/gamma/stack/StackHeaderConfigNativeComponent';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackHeaderConfig(props: StackHeaderConfigProps) {
  const { children, ...filteredProps } = props;
  return (
    <StackHeaderConfigNativeComponent
      collapsable={false}
      style={StyleSheet.absoluteFill}
      {...filteredProps}>
      {children}
    </StackHeaderConfigNativeComponent>
  );
}

export default StackHeaderConfig;
