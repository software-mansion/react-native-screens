import React from 'react';
import { StyleSheet } from 'react-native';
import ComposeBottomSheetNativeComponent from '../../../../fabric/gamma/modals/compose-bottom-sheet/ComposeBottomSheetNativeComponent';
import type { ComposeBottomSheetProps } from './ComposeBottomSheet.types';

export function ComposeBottomSheet(props: ComposeBottomSheetProps) {
  const { children, isOpen, onDismiss, ...rest } = props;

  return (
    <ComposeBottomSheetNativeComponent
      style={styles.host}
      isOpen={isOpen}
      onDismiss={onDismiss}
      {...rest}>
      {children}
    </ComposeBottomSheetNativeComponent>
  );
}

const styles = StyleSheet.create({
  // We use absolute positioning so the Host view doesn't affect the layout of its siblings.
  // Setting `top: 0` and `left: 0` explicitly anchors the view to a predictable origin,
  // preventing it from floating at an arbitrary offset based on its position in the Element tree.
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
