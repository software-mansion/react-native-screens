import type { ViewProps } from 'react-native';

export interface FormSheetProps extends ViewProps {
  /**
   * Controls whether the sheet is currently presented or dismissed.
   */
  isOpen: boolean;

  /**
   * Array of fractional heights [0..1] that map to `UISheetPresentationController` detents.
   * For example, `[0.5, 1.0]` creates a medium and a large detent.
   */
  detents?: number[] | undefined;

  /**
   * Called when the user interactively dismisses the sheet (e.g., by swiping it down).
   * Use this to sync your local state (`isOpen = false`).
   */
  onDismiss?: (() => void) | undefined;
}
