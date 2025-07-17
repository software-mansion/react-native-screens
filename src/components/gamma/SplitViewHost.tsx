import React from 'react';
import { StyleSheet } from 'react-native';
import type { ViewProps } from 'react-native';
import SplitViewHostNativeComponent from '../../fabric/gamma/SplitViewHostNativeComponent';
import type {
  NativeProps,
  SplitViewSplitBehavior,
} from '../../fabric/gamma/SplitViewHostNativeComponent';

export type SplitViewNativeProps = NativeProps & {
  // SplitView appearance

  splitBehavior?: SplitViewSplitBehavior;
};

type SplitViewHostProps = {
  children?: ViewProps['children'];
} & SplitViewNativeProps;

function SplitViewHost({ children, splitBehavior, primaryEdge }: SplitViewHostProps) {
  return (
    <SplitViewHostNativeComponent
      style={styles.container}
      splitBehavior={splitBehavior}
      primaryEdge={primaryEdge}>
      {children}
    </SplitViewHostNativeComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SplitViewHost;
