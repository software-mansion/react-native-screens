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
   * @summary Determines whether the sheet requests a grabber at the top.
   *
   * When `true`, the sheet requests that a small grabber indicator be shown
   * at the top to hint that the sheet can be resized. The system may still
   * hide the grabber in some presentation contexts.
   *
   * @default false
   * @platform ios
   */
  prefersGrabberVisible?: boolean | undefined;

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

  /**
   * @summary The largest sheet detent for which a view underneath won't be dimmed.
   *
   * This prop can be set to a number, which indicates the index of the detent in the
   * `detents` array for which there won't be a dimming view beneath the sheet.
   *
   * Additionally, there are the following options available:
   * * `none` - there will be a dimming view for all detent levels.
   * * `last` - there won't be a dimming view for any detent level.
   *
   * @default 'none'
   * @platform ios
   */
  largestUndimmedDetentIndex?: number | 'none' | 'last' | undefined;

  /**
   * @summary The index of the detent the sheet should snap to when first opened.
   *
   * This prop can be set to a number, indicating the zero-based index of the detent in the
   * `detents` array. If set to `last`, it will snap to the largest defined detent.
   * This prop only applies when the sheet transitions from closed to open.
   *
   * @default 0
   * @platform ios
   */
  initialDetentIndex?: number | 'last' | undefined;

  /**
   * @summary Determines whether scrolling expands the sheet to a larger detent when scrolled to the edge.
   *
   * On iOS, this maps directly to `UISheetPresentationController.prefersScrollingExpandsWhenScrolledToEdge`.
   *
   * @default true
   * @platform ios
   */
  shouldExpandWhenScrolledToEdge?: boolean | undefined;

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
