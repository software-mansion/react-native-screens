import React, { useCallback } from 'react';
import StackHeaderItemIOSNativeComponent from '../../../../../fabric/gamma/stack/StackHeaderItemIOSNativeComponent';
import type { HeaderItemPressEvent } from '../../../../../fabric/gamma/stack/StackHeaderItemIOSNativeComponent';
import type { StackHeaderItemProps } from './StackHeaderItem.ios.types';
import { NativeSyntheticEvent, StyleSheet } from 'react-native';

export default function StackHeaderItem(props: StackHeaderItemProps) {
  const { render, onPress, ...rest } = props;

  // `rest.menu` includes some JS callback within nested menu specification
  // codegen strips JS functions and replaces them with NULLT and keys of such type
  // are omitted inside RNSConvertFollyDynamicToId so we can safely pass `rest.menu` as-is

  const handlePress = useCallback(
    (_event: NativeSyntheticEvent<HeaderItemPressEvent>) => {
      onPress?.();
    },
    [onPress],
  );

  return (
    <StackHeaderItemIOSNativeComponent
      {...rest}
      // We need to tell iOS that we want the handler to be attached only when we actually require it
      // because doing so makes the menu appear on long press instead of tap
      respondsToOnPress={!!onPress}
      onHeaderItemPress={handlePress}
      style={styles.config}>
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
