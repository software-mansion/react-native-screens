import type { ColorValue, NativeSyntheticEvent, ViewProps } from 'react-native';

export type EmptyEventPayload = Record<string, never>;

export type FormSheetEventHandler<T> = (e: NativeSyntheticEvent<T>) => void;

export interface FormSheetDetentChangedEvent {
  index: number;
}

export type FormSheetNativeContainerStyleProps = {
  /**
   * @summary Specifies the background color of the native container hosting the sheet content.
   *
   * @platform ios
   */
  backgroundColor?: ColorValue | undefined;
};

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
   * @summary Defines the resting positions of the sheet.
   *
   * This can be either an array of fractional screen heights (ranging from `0.0` to `1.0`)
   * or the `fitToContents` string literal.
   *
   * - Fractional heights: The sheet will snap to these specific height proportions.
   * - `fitToContents`: The sheet automatically calculates its height to wrap its content.
   *   It will dynamically animate to adapt to any internal layout changes.
   *
   * On iOS, these map directly to `UISheetPresentationController` detents.
   * If an empty array is provided, it defaults to a single large detent.
   *
   * @remarks
   * `fitToContents` is supported on iOS 16+. On iOS 15, it falls back to a medium detent
   *
   * @platform ios
   */
  detents?: number[] | 'fitToContents' | undefined;

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
   * @summary Determines whether scrolling expands the sheet to a larger detent.
   *
   * When set to `true`, scrolling up within a child scroll view (starting from the top edge)
   * will first expand the sheet to a larger detent before scrolling the content.
   * When set to `false`, scrolling within the child scroll view will scroll the content normally
   * without expanding the sheet.
   * Note that manual dragging of the sheet's non-scrollable area will still expand the
   * sheet regardless of this setting.
   *
   * On iOS, this maps directly to `UISheetPresentationController.prefersScrollingExpandsWhenScrolledToEdge`.
   *
   * @default true
   * @platform ios
   */
  prefersScrollingExpandsWhenScrolledToEdge?: boolean | undefined;

  /**
   * @summary Prevents the user from dismissing the sheet natively by swiping down or tapping the backdrop.
   *
   * When set to `true`, the sheet will resist the swipe-down gesture and backdrop tap,
   * remaining on the resting detent. Programmatically dismissing the sheet via `isOpen={false}` will still work.
   *
   * @default false
   * @platform ios
   */
  preventNativeDismiss?: boolean | undefined;

  /**
   * @summary Style applied to the native container hosting the sheet content.
   *
   * These properties are forwarded directly to the underlying native view.
   *
   * @platform ios
   */
  nativeContainerStyle?: FormSheetNativeContainerStyleProps | undefined;

  // Events

  /**
   * @summary A callback that gets invoked when the FormSheet will appear.
   * This is called as soon as the transition begins.
   *
   * @platform ios
   */
  onWillAppear?: FormSheetEventHandler<EmptyEventPayload> | undefined;

  /**
   * @summary A callback that gets invoked when the FormSheet did appear.
   * This is called as soon as the transition ends.
   *
   * @platform ios
   */
  onDidAppear?: FormSheetEventHandler<EmptyEventPayload> | undefined;

  /**
   * @summary A callback that gets invoked when the FormSheet will disappear.
   * This is called as soon as the transition begins.
   *
   * @platform ios
   */
  onWillDisappear?: FormSheetEventHandler<EmptyEventPayload> | undefined;

  /**
   * @summary A callback that gets invoked when the FormSheet did disappear.
   * This is called as soon as the transition ends.
   *
   * @platform ios
   */
  onDidDisappear?: FormSheetEventHandler<EmptyEventPayload> | undefined;

  /**
   * @summary Called when the sheet is dismissed programmatically.
   *
   * This event is fired when the sheet was dismissed via the `isOpen` prop changing to `false`.
   *
   * @platform ios
   */
  onDismiss?: FormSheetEventHandler<EmptyEventPayload> | undefined;

  /**
   * @summary Called when the sheet is dismissed natively.
   *
   * It is highly recommended to use this callback to synchronize
   * your local React state to prevent UI mismatches (e.g., updating `isOpen` back to `false`).
   *
   * @platform ios
   */
  onNativeDismiss?: FormSheetEventHandler<EmptyEventPayload> | undefined;

  /**
   * @summary Called when the sheet settles at a new detent.
   *
   * Provides the `index` of the newly selected detent from the `detents` array.
   *
   * @platform ios
   */
  onDetentChanged?:
    | FormSheetEventHandler<FormSheetDetentChangedEvent>
    | undefined;

  /**
   * @summary Called when the user attempts to dismiss the sheet by swiping down or tapping the backdrop, but the dismissal is prevented.
   *
   * This event is only fired if `preventNativeDismiss` is set to `true`.
   * It is useful for triggering custom feedback, such as an alert
   * to inform the user why the sheet cannot be closed.
   *
   * @platform ios
   */
  onNativeDismissPrevented?:
    | FormSheetEventHandler<EmptyEventPayload>
    | undefined;
}
