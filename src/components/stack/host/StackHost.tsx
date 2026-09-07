import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import StackHostNativeComponent from '../../../fabric/stack/StackHostNativeComponent';
import type { StackHostProps } from './StackHost.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackHost(props: StackHostProps) {
  const { children, ref, direction, ...restProps } = props;

  // RN's `direction` style sets the native View's layoutDirection, which the
  // stack's native subtree inherits. iOS needs a trait override instead.
  const directionStyle = Platform.OS === 'android' ? { direction } : undefined;

  return (
    <StackHostNativeComponent
      ref={ref}
      style={[styles.container, directionStyle]}
      {...restProps}>
      {children}
    </StackHostNativeComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default StackHost;
