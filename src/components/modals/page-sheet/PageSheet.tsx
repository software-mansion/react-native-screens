import React from 'react';
import { SheetBase } from '../sheet/SheetBase';
import type { PageSheetProps } from './PageSheet.types';

/**
 * Presents its children in a native sheet that, on iPad, is larger than
 * {@link FormSheet}.
 *
 * @remarks
 * The sheet is presented when {@link PageSheetProps.isOpen | isOpen} becomes
 * `true` and dismissed when it becomes `false`. It rests at the heights given
 * by {@link PageSheetProps.detents | detents}; the user can drag it between
 * them, and dismiss it natively unless
 * {@link PageSheetProps.preventNativeDismiss | preventNativeDismiss} is set.
 *
 * On iPhone, the sheet looks the same as {@link FormSheet}: it spans the full
 * width of the screen and is anchored to its bottom. On iPad, it is a large
 * card, and the screen behind it is dimmed. On Android, it is the same bottom
 * sheet dialog as {@link FormSheet}.
 *
 * @see {@link FormSheet} for a sheet that is a smaller centered panel on iPad.
 * @platform android, ios
 */
export function PageSheet(props: PageSheetProps) {
  return <SheetBase {...props} presentationStyle="pageSheet" />;
}
