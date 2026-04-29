import type { ViewProps } from 'react-native';

export interface FormSheetProps extends ViewProps {
  /**
   * Determines whether the form sheet is currently visible.
   * When `true`, the sheet is presented. When `false`, it is dismissed.
   */
  isOpen: boolean;

  /**
   * An array of fractional screen heights (ranging from `0` to `1`) that define
   * the resting positions of the sheet.
   *
   * On iOS, these map directly to `UISheetPresentationController` detents.
   */
  detents?: number[] | undefined;

  /**
   * Called when the sheet is dismissed.
   * It is highly recommended to use this callback to synchronize
   * your local state to prevent UI mismatch (e.g., updating `isOpen` to `false`).
   */
  onDismiss?: (() => void) | undefined;
}
