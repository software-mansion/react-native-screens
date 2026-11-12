import React from 'react';
import { SheetBase } from '../sheet';
import type { FormSheetProps } from './FormSheet.types';

/**
 * Presents its children in a native sheet.
 *
 * @remarks
 * The sheet is presented when {@link FormSheetProps.isOpen | isOpen} becomes
 * `true` and dismissed when it becomes `false`. It rests at the heights given
 * by {@link FormSheetProps.detents | detents}; the user can drag it between
 * them, and dismiss it natively unless
 * {@link FormSheetProps.preventNativeDismiss | preventNativeDismiss} is set.
 *
 * @platform android, ios, tvos >= 26
 */
export function FormSheet(props: FormSheetProps) {
  return <SheetBase {...props} />;
}
