import React from 'react';
import { StyleSheet } from 'react-native';
import FormSheetHostNativeComponent from '../../../../fabric/gamma/modals/form-sheet/FormSheetHostNativeComponent';
import type { FormSheetProps } from './FormSheet.types';

export function FormSheet(props: FormSheetProps) {
  return <FormSheetHostNativeComponent style={styles.host} {...props} />;
}

const styles = StyleSheet.create({
  // We use absolute positioning so the Host view doesn't affect the layout of its siblings.
  // Setting `top: 0` and `left: 0` explicitly anchors the view to a predictable origin,
  // preventing it from floating at an arbitrary offset based on its position in the Element tree.
  //
  // IMPORTANT: "Absolute" positioning is still relative to the nearest positioned containing
  // box. This anchors it to that specific container's (0,0), not the global window (0,0).
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
