import React from 'react';
import { SheetBase } from '../sheet/SheetBase';
import type { FormSheetProps } from './FormSheet.types';

/**
 * Modal sheet presented with `UIModalPresentationFormSheet`.
 *
 * @remarks
 * On iPhone it is a full-width sheet anchored to the bottom of the screen. On
 * iPad it is a centered floating panel of a fixed width; the presenting screen
 * is dimmed but not scaled back. Similar to {@link PageSheet}: the two differ
 * only in iPad layout. On Android both present the same bottom sheet dialog.
 *
 * @platform android, ios, tvos >= 26
 */
export function FormSheet(props: FormSheetProps) {
  return <SheetBase {...props} presentationStyle="formSheet" />;
}
