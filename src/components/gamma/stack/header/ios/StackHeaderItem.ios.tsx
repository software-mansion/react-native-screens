import React from 'react';
import StackHeaderItemIOSNativeComponent from '../../../../../fabric/gamma/stack/StackHeaderItemIOSNativeComponent';
import type { StackHeaderItemProps } from './StackHeaderItem.ios.types';
import { StyleSheet } from 'react-native';

export default function StackHeaderItem(props: StackHeaderItemProps) {
  const { render, ...rest } = props;
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
