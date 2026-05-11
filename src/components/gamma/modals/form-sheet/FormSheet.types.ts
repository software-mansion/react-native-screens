import { ViewProps } from 'react-native';

export interface FormSheetProps {
  children?: ViewProps['children'] | undefined;

  /**
   * @summary Determines whether the form sheet is currently visible.
   *
   * Presentation is driven by state transitions: updating this property
   * from `false` to `true` triggers the sheet to present, while changing
   * it from `true` to `false` triggers a programmatic dismissal.
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

  /**
   * @summary The corner radius that the sheet will attempt to present with.
   *
   * If set to `systemDefault` or a negative number, it defaults to the system's
   * automatic dimension (`UISheetPresentationControllerAutomaticDimension`).
   *
   * @default systemDefault
   * @platform ios
   */
  preferredCornerRadius?: number | 'systemDefault' | undefined;

  // Events
  /**
   * @summary Called when the sheet is dismissed natively.
   *
   * It is highly recommended to use this callback to synchronize
   * your local React state to prevent UI mismatches (e.g., updating `isOpen` back to `false`).
   *
   * @platform ios
   */
  onNativeDismiss?: (() => void) | undefined;
}
