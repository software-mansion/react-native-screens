import React from 'react';
import { StackHeaderSubviewProps } from './StackHeaderSubview.android.types';
import { StyleSheet } from 'react-native';
import StackHeaderSubviewAndroidNativeComponent from '../../../../../fabric/gamma/stack/StackHeaderSubviewAndroidNativeComponent';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackHeaderSubview(props: StackHeaderSubviewProps) {
  const { children, ...filteredProps } = props;
  return (
    <StackHeaderSubviewAndroidNativeComponent
      collapsable={false}
      style={
        filteredProps.type === 'background'
          ? StyleSheet.absoluteFill
          : styles.absoluteStartTop
      }
      {...filteredProps}>
      {children}
    </StackHeaderSubviewAndroidNativeComponent>
  );
}

export default StackHeaderSubview;

const styles = StyleSheet.create({
  absoluteStartTop: {
    position: 'absolute',
    start: 0,
    top: 0,
  },
});
