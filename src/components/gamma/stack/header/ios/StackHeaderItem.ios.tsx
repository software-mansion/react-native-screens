import React from 'react';
import StackHeaderItemIOSNativeComponent from '../../../../../fabric/gamma/stack/StackHeaderItemIOSNativeComponent';
import type { StackHeaderItemProps } from './StackHeaderItem.ios.types';
import { StyleSheet } from 'react-native';

export default function StackHeaderItem(props: StackHeaderItemProps) {
  const { render, ...rest } = props;

  // `rest.menu` includes some JS callback within nested menu specification
  // codegen strips JS functions and replaces them with NULLT and keys of such type
  // are omitted inside RNSConvertFollyDynamicToId so we can safely pass `rest.menu` as-is

  return (
    <StackHeaderItemIOSNativeComponent {...rest} style={styles.config}>
      {render?.()}
    </StackHeaderItemIOSNativeComponent>
  );
}

const styles = StyleSheet.create({
  config: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
