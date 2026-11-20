import type { StyleProp, ViewProps } from 'react-native';
import type { EmptyEventPayload, NativeEventHandler } from '../../shared/types';
import type {
  SheetBackgroundEffect,
  SheetDetentChangedEvent,
  SheetDetents,
  SheetInitialDetentIndex,
  SheetLargestUndimmedDetentIndex,
  SheetNativeContainerStyleProps,
  SheetPreferredCornerRadius,
} from '../sheet';

/**
 * Payload of the page sheet's `onDetentChanged` event.
 *
 * @remarks
 * See {@link SheetDetentChangedEvent} for its fields.
 */
export type PageSheetDetentChangedEvent = SheetDetentChangedEvent;

/**
 * Resting positions of a page sheet.
 *
 * @remarks
 * Accepts any {@link SheetDetents} value.
 */
export type PageSheetDetents = SheetDetents;

/**
 * Corner radius of a page sheet.
 *
 * @remarks
 * Accepts any {@link SheetPreferredCornerRadius} value.
 */
export type PageSheetPreferredCornerRadius = SheetPreferredCornerRadius;

/**
 * Largest detent of a page sheet at which the content underneath is not
 * dimmed.
 *
 * @remarks
 * Accepts any {@link SheetLargestUndimmedDetentIndex} value.
 */
export type PageSheetLargestUndimmedDetentIndex =
  SheetLargestUndimmedDetentIndex;

/**
 * Detent a page sheet opens at.
 *
 * @remarks
 * Accepts any {@link SheetInitialDetentIndex} value.
 */
export type PageSheetInitialDetentIndex = SheetInitialDetentIndex;

/**
 * Material the system renders behind the page sheet's content.
 *
 * @remarks
 * Accepts any {@link SheetBackgroundEffect} value.
 */
export type PageSheetBackgroundEffect = SheetBackgroundEffect;

/**
 * Style of the native container hosting a page sheet's content.
 *
 * @remarks
 * See {@link SheetNativeContainerStyleProps} for its fields.
 */
export type PageSheetNativeContainerStyleProps = SheetNativeContainerStyleProps;

/**
 * Props for {@link PageSheet}.
 */
export interface PageSheetProps {
  /**
   * Content of the sheet.
   *
   * @platform android, ios
   */
  children?: ViewProps['children'] | undefined;

  /**
   * Determines whether the sheet is currently visible.
   *
   * @remarks
   * Presentation is driven by state transitions: updating this property from
   * `false` to `true` triggers the sheet to present, while changing it from
   * `true` to `false` triggers a programmatic dismissal.
   *
   * @platform android, ios
   */
  isOpen: boolean;

  /**
   * Defines the resting positions of the sheet.
   *
   * @remarks
   * An empty array also gives the sheet a single large detent. On Android, at
   * most three detents are supported. `'fitToContents'` is supported on
   * iOS 16+.
   *
   * @note
   * This is an implementation detail and may change. On iOS 15,
   * `'fitToContents'` falls back to a large detent, and only the system's
   * medium and large detents are used.
   *
   * @defaultValue The sheet has a single large detent.
   * @see {@link https://developer.apple.com/documentation/uikit/uisheetpresentationcontroller/detents | UISheetPresentationController.detents}
   * @platform android, ios
   */
  detents?: PageSheetDetents | undefined;

  /**
   * Determines whether the sheet shows a grabber at the top.
   *
   * @remarks
   * When `true`, a small grabber indicator is shown at the top of the sheet to
   * hint that the sheet can be resized.
   *
   * @defaultValue `false`
   * @platform android, ios
   */
  prefersGrabberVisible?: boolean | undefined;

  /**
   * The corner radius that the sheet will attempt to present with.
   *
   * @remarks
   * If set to `'systemDefault'` or a negative number, the system's default
   * corner radius is used.
   *
   * @defaultValue `'systemDefault'`
   * @platform android >= 33, ios
   */
  preferredCornerRadius?: PageSheetPreferredCornerRadius | undefined;

  /**
   * The largest sheet detent for which a view underneath won't be dimmed.
   *
   * @defaultValue `'none'`
   * @platform ios
   */
  largestUndimmedDetentIndex?: PageSheetLargestUndimmedDetentIndex | undefined;

  /**
   * The index of the detent the sheet should snap to when first opened.
   *
   * @remarks
   * This prop only applies when the sheet transitions from closed to open.
   *
   * @defaultValue `0`
   * @platform android, ios
   */
  initialDetentIndex?: PageSheetInitialDetentIndex | undefined;

  /**
   * Determines whether scrolling expands the sheet to a larger detent.
   *
   * @remarks
   * When set to `true`, scrolling up within a child scroll view (starting from
   * the top edge) will first expand the sheet to a larger detent before
   * scrolling the content. When set to `false`, scrolling within the child
   * scroll view will scroll the content normally without expanding the sheet.
   * Note that manual dragging of the sheet's non-scrollable area will still
   * expand the sheet regardless of this setting.
   *
   * @defaultValue `true`
   * @see {@link https://developer.apple.com/documentation/uikit/uisheetpresentationcontroller/prefersscrollingexpandswhenscrolledtoedge | UISheetPresentationController.prefersScrollingExpandsWhenScrolledToEdge}
   * @platform ios
   */
  prefersScrollingExpandsWhenScrolledToEdge?: boolean | undefined;

  /**
   * Prevents the user from dismissing the sheet natively by swiping down or
   * tapping the backdrop.
   *
   * @remarks
   * When set to `true`, the sheet will resist the swipe-down gesture and
   * backdrop tap, remaining on the resting detent. Programmatically dismissing
   * the sheet via `isOpen={false}` will still work.
   *
   * @defaultValue `false`
   * @platform android, ios
   */
  preventNativeDismiss?: boolean | undefined;

  /**
   * Style applied to the native container hosting the sheet content.
   *
   * @platform android, ios
   */
  nativeContainerStyle?:
    | StyleProp<PageSheetNativeContainerStyleProps>
    | undefined;

  /**
   * Material the system renders behind the sheet's content.
   *
   * @remarks
   * The material is drawn behind the native container, so an opaque
   * `nativeContainerStyle.backgroundColor` covers it.
   *
   * @defaultValue `'automatic'`
   * @see {@link PageSheetBackgroundEffect}
   * @see {@link https://developer.apple.com/documentation/uikit/uipresentationcontroller/backgroundeffect | UIPresentationController.backgroundEffect}
   * @platform ios >= 26.1
   */
  backgroundEffect?: PageSheetBackgroundEffect | undefined;

  // Events

  /**
   * A callback that gets invoked when the sheet will appear. This is
   * called as soon as the transition begins.
   *
   * @platform android, ios
   */
  onWillAppear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * A callback that gets invoked when the sheet did appear. This is called
   * as soon as the transition ends.
   *
   * @platform android, ios
   */
  onDidAppear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * A callback that gets invoked when the sheet will disappear. This is
   * called as soon as the transition begins.
   *
   * @platform android, ios
   */
  onWillDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * A callback that gets invoked when the sheet did disappear. This is
   * called as soon as the transition ends.
   *
   * @platform android, ios
   */
  onDidDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the sheet is dismissed programmatically.
   *
   * @remarks
   * This event is fired when the sheet was dismissed via the `isOpen` prop
   * changing to `false`.
   *
   * @platform android, ios
   */
  onDismiss?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the sheet is dismissed natively.
   *
   * @remarks
   * It is highly recommended to use this callback to synchronize your local
   * React state to prevent UI mismatches, e.g. by setting `isOpen` back to
   * `false`.
   *
   * @platform android, ios
   */
  onNativeDismiss?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the sheet settles at a new detent.
   *
   * @remarks
   * Provides the `index` of the newly selected detent from the `detents`
   * array.
   *
   * @note
   * This is an implementation detail and may change. On iOS 15, the sheet
   * uses only the system's medium and large detents, and the index refers to
   * them: `0` for medium and `1` for large. With fewer than two detents, the
   * index is always `0`.
   *
   * @platform android, ios
   */
  onDetentChanged?: NativeEventHandler<PageSheetDetentChangedEvent> | undefined;

  /**
   * Called when the user attempts to dismiss the sheet by swiping down or
   * tapping the backdrop, but the dismissal is prevented.
   *
   * @remarks
   * This event is only fired if `preventNativeDismiss` is set to `true`. It is
   * useful for triggering custom feedback, such as an alert to inform the user
   * why the sheet cannot be closed.
   *
   * @platform android, ios
   */
  onNativeDismissPrevented?: NativeEventHandler<EmptyEventPayload> | undefined;
}
