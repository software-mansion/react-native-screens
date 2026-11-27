import React from 'react';
import { SheetBase } from '../sheet';
import type { FormSheetProps } from './FormSheet.types';

/**
 * Presents its children in a native sheet.
 *
 * @remarks
 * The sheet is presented when
 * {@link FormSheetPropsBase.isOpen | isOpen} becomes `true` and dismissed
 * when it becomes `false`. It rests at the heights given by
 * {@link FormSheetPropsBase.detents | detents}; the user can drag it between
 * them, and dismiss it natively unless
 * {@link FormSheetPropsBase.preventNativeDismiss | preventNativeDismiss} is
 * set.
 *
 * On iPhone in portrait, the sheet spans the full width of the screen and is
 * anchored to its bottom. On iPad, it is a centered floating panel of a fixed
 * width, and the screen behind it is dimmed. On Android, it is a bottom sheet
 * dialog.
 *
 * @see {@link PageSheet} for a sheet that differs only in its iPad layout.
 * @platform android, ios, tvos >= 26
 */
export function FormSheet(props: FormSheetProps) {
  return <SheetBase {...props} presentationStyle="formSheet" />;
}
