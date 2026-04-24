import React from 'react';
import { StyleSheet } from 'react-native';
import ModalFormSheetNativeComponent from '../../../fabric/gamma/form-sheet/ModalFormSheetNativeComponent';
import type { ModalFormSheetProps } from './ModalFormSheet.types';

export function ModalFormSheet(props: ModalFormSheetProps) {
  const { isOpen, detents, onDismiss, children, style, ...rest } = props;

  return (
    <ModalFormSheetNativeComponent
      isOpen={isOpen}
      detents={detents}
      onDismiss={onDismiss}
      style={[style, styles.host]}
      {...rest}>
      {children}
    </ModalFormSheetNativeComponent>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  },
});
