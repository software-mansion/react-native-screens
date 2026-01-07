import React from 'react';
import { StyleSheet } from 'react-native';
import StackHostNativeComponent from '../../../fabric/gamma/stack/StackHostNativeComponent';
import type { StackHostProps } from './StackHost.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackHost({ children, ref }: StackHostProps) {
  return (
    <StackHostNativeComponent ref={ref} style={styles.container}>
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
