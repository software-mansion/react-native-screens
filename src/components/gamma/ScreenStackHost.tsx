import React from 'react';
import { StyleSheet } from 'react-native';
import type { ViewProps } from 'react-native';
import type { NativeProps } from '../../fabric/gamma/ScreenStackHostNativeComponent';
import ScreenStackHostNativeComponent from '../../fabric/gamma/ScreenStackHostNativeComponent';

export type ScreenStackNativeProps = NativeProps & {
  // Overrides
};

type ScreenStackHostProps = {
  children?: ViewProps['children'];
} & ScreenStackNativeProps;

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
