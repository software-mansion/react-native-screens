import React from 'react';
import { StyleSheet } from 'react-native';
import type { ViewProps } from 'react-native';
import SplitViewHostNativeComponent from '../../fabric/gamma/SplitViewHostNativeComponent';
import type { NativeProps } from '../../fabric/gamma/SplitViewHostNativeComponent';

export type SplitViewNativeProps = NativeProps & {
  // Overrides
};

type SplitViewHostProps = {
  children?: ViewProps['children'];
} & SplitViewNativeProps;

function ScreenStackHost({ children }: SplitViewHostProps) {
  return (
    <SplitViewHostNativeComponent style={styles.container}>
      {children}
    </SplitViewHostNativeComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenStackHost;
