import React from 'react';
import { StyleSheet } from 'react-native';
import { StackHeaderSubviewProps } from './StackHeaderSubview.types';
import StackHeaderSubviewNativeComponent from '../../../../fabric/gamma/stack/StackHeaderSubviewNativeComponent';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackHeaderSubview(props: StackHeaderSubviewProps) {
  const { children, ...filteredProps } = props;
  return (
    <StackHeaderSubviewNativeComponent
      collapsable={false}
      style={StyleSheet.absoluteFill}
      {...filteredProps}>
      {children}
    </StackHeaderSubviewNativeComponent>
  );
}

export default StackHeaderSubview;
