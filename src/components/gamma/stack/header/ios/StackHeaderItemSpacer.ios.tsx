import React from 'react';
import StackHeaderItemSpacerIOSNativeComponent from '../../../../../fabric/gamma/stack/StackHeaderItemSpacerIOSNativeComponent';
import type { StackHeaderItemSpacerProps } from './StackHeaderItemSpacer.ios.types';
import { StyleSheet } from 'react-native';

export default function StackHeaderItemSpacer(
  props: StackHeaderItemSpacerProps,
) {
  return (
    <StackHeaderItemSpacerIOSNativeComponent {...props} style={styles.config} />
  );
}

const styles = StyleSheet.create({
  config: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
