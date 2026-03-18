import React from 'react';
import { StyleSheet } from 'react-native';
import { StackHeaderConfigurationProps } from './StackHeaderConfiguration.types';
import StackHeaderConfigurationNativeComponent from '../../../../fabric/gamma/stack/StackHeaderConfigurationNativeComponent';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackHeaderConfiguration(props: StackHeaderConfigurationProps) {
  const { children, ...filteredProps } = props;
  return (
    <StackHeaderConfigurationNativeComponent
      collapsable={false}
      style={StyleSheet.absoluteFill}
      {...filteredProps}>
      {children}
    </StackHeaderConfigurationNativeComponent>
  );
}

export default StackHeaderConfiguration;
