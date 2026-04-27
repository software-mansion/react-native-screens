import React from 'react';
import { StyleSheet } from 'react-native';
import InlineModalProviderNativeComponent from '../../../fabric/gamma/inline-modal/InlineModalProviderNativeComponent';
import type { InlineModalProviderProps } from './InlineModalProvider.types';

export function InlineModalProvider({
  style,
  ...rest
}: InlineModalProviderProps) {
  return (
    <InlineModalProviderNativeComponent
      style={[style, styles.container]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
