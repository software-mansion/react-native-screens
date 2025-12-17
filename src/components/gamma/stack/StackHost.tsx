import React from 'react';
import { StyleSheet } from 'react-native';
import ScreenStackHostNativeComponent from '../../../fabric/gamma/stack/ScreenStackHostNativeComponent';
import type { ScreenStackHostProps } from './StackHost.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackHost({ children }: ScreenStackHostProps) {
  return (
    <ScreenStackHostNativeComponent style={styles.container}>
      {children}
    </ScreenStackHostNativeComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default StackHost;
