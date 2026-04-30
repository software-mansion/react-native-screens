import { ViewProps } from 'react-native';

export interface FormSheetProps {
  children?: ViewProps['children'] | undefined;

  /**
   * @summary Determines whether the form sheet is currently visible.
   *
   * When `true`, the sheet is presented. When `false`, it is dismissed.
   *
   * @platform ios
   */
  isOpen: boolean;

  /**
   * @summary An array of fractional screen heights (ranging from `0.0` to `1.0`) that define
   * the resting positions of the sheet.
   *
   * On iOS, these map directly to `UISheetPresentationController` detents.
   * If an empty array is provided, it defaults to a single large detent.
   *
   * @platform ios
   */
  detents?: number[] | undefined;

  // Events
  /**
   * @summary Called when the native sheet is dismissed.
   *
   * It is highly recommended to use this callback to synchronize
   * your local React state to prevent UI mismatches (e.g., updating `isOpen` back to `false`).
   *
   * @platform ios
   */
  onDismiss?: (() => void) | undefined;
}
