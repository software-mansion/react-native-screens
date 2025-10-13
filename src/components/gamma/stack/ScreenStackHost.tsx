import React from 'react';
import { StyleSheet } from 'react-native';
import ScreenStackHostNativeComponent from '../../../fabric/gamma/ScreenStackHostNativeComponent';
import type { ScreenStackHostProps } from './ScreenStackHost.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function ScreenStackHost({ children }: ScreenStackHostProps) {
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

export default ScreenStackHost;
