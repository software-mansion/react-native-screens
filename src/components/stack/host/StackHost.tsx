import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import StackHostNativeComponent from '../../../fabric/stack/StackHostNativeComponent';
import type { StackHostProps } from './StackHost.types';
import SplitColumnMarkerContext from '../../split/SplitColumnMarkerContext';

function StackHost(props: StackHostProps) {
  const { children, ref, direction, ...restProps } = props;

  // RN's `direction` style sets the native View's layoutDirection, which the
  // stack's native subtree inherits. iOS needs a trait override instead.
  const directionStyle = Platform.OS === 'android' ? { direction } : undefined;

  // In a Split column the host is out of layout; its screens are laid out as
  // children of the split host and take the column frame from UIKit. The host
  // keeps its native view, which owns the navigation controller the Split
  // installs in the column.
  const isSplitColumnContent =
    React.useContext(SplitColumnMarkerContext) && Platform.OS === 'ios';
  const columnContentStyle = isSplitColumnContent
    ? styles.columnContent
    : undefined;

  return (
    <StackHostNativeComponent
      ref={ref}
      style={[styles.container, directionStyle, columnContentStyle]}
      {...restProps}>
      {children}
    </StackHostNativeComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  columnContent: {
    display: 'contents',
  },
});

export default StackHost;
