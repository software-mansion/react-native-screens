import React from 'react';
import { StyleSheet } from 'react-native';
import FormSheetHostNativeComponent from '../../../../fabric/gamma/modals/form-sheet/FormSheetHostNativeComponent';
import type { FormSheetProps } from './FormSheet.types';

export function FormSheet(props: FormSheetProps) {
  const { children, style, ...rest } = props;

  return (
    <FormSheetHostNativeComponent style={[style, styles.host]} {...rest}>
      {children}
    </FormSheetHostNativeComponent>
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
