import React from 'react';
import { SheetBase } from '../sheet/SheetBase';
import type { PageSheetProps } from './PageSheet.types';

/**
 * Modal sheet presented with `UIModalPresentationPageSheet`.
 *
 * @remarks
 * On iPhone it is indistinguishable from {@link FormSheet}: a full-width sheet
 * anchored to the bottom of the screen. On iPad it is a wide, bottom-anchored
 * card and the presenting screen is dimmed and scaled back behind it, where
 * {@link FormSheet} shows a small centered panel. On Android both components
 * present the same bottom sheet dialog.
 *
 * @platform android, ios
 */
export function PageSheet(props: PageSheetProps) {
  return <SheetBase {...props} presentationStyle="pageSheet" />;
}
