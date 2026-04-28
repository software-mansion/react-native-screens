import React from 'react';
import { StyleSheet } from 'react-native';
import FormSheetNativeComponent from '../../../fabric/gamma/form-sheet/FormSheetNativeComponent';
import type { FormSheetProps } from './FormSheet.types';

export function FormSheet(props: FormSheetProps) {
  const { isOpen, detents, onDismiss, children, style, ...rest } = props;

  return (
    <FormSheetNativeComponent
      isOpen={isOpen}
      detents={detents}
      onDismiss={onDismiss}
      style={[style, styles.host]}
      {...rest}>
      {children}
    </FormSheetNativeComponent>
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
