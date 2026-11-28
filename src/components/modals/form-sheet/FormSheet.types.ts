import type { Ref } from 'react';
import type { StyleProp, ViewProps } from 'react-native';
import type { EmptyEventPayload, NativeEventHandler } from '../../shared/types';
import type {
  SheetDetentChangedEvent,
  SheetDetents,
  SheetInitialDetentIndex,
  SheetLargestUndimmedDetentIndex,
  SheetNativeContainerStyleProps,
  SheetPreferredCornerRadius,
  SheetCommands,
  SheetSelectDetentIndex,
} from '../sheet';
import type { FormSheetPropsIOS } from './FormSheet.ios.types';

/**
 * Payload of the form sheet's `onDetentChanged` event.
 *
 * @remarks
 * See {@link SheetDetentChangedEvent} for its fields.
 */
export type FormSheetDetentChangedEvent = SheetDetentChangedEvent;

/**
 * Resting positions of a form sheet.
 *
 * @remarks
 * Accepts any {@link SheetDetents} value.
 */
export type FormSheetDetents = SheetDetents;

/**
 * Corner radius of a form sheet.
 *
 * @remarks
 * Accepts any {@link SheetPreferredCornerRadius} value.
 */
export type FormSheetPreferredCornerRadius = SheetPreferredCornerRadius;

/**
 * Largest detent of a form sheet at which the content underneath is not
 * dimmed.
 *
 * @remarks
 * Accepts any {@link SheetLargestUndimmedDetentIndex} value.
 */
export type FormSheetLargestUndimmedDetentIndex =
  SheetLargestUndimmedDetentIndex;

/**
 * Detent a form sheet opens at.
 *
 * @remarks
 * Accepts any {@link SheetInitialDetentIndex} value.
 */
export type FormSheetInitialDetentIndex = SheetInitialDetentIndex;

/**
 * Style of the native container hosting a form sheet's content.
 *
 * @remarks
 * See {@link SheetNativeContainerStyleProps} for its fields.
 */
export type FormSheetNativeContainerStyleProps = SheetNativeContainerStyleProps;

/**
 * Detent to move a presented form sheet to with
 * {@link FormSheetCommands.selectDetent | selectDetent}.
 *
 * @remarks
 * Accepts any {@link SheetSelectDetentIndex} value.
 */
export type FormSheetSelectDetentIndex = SheetSelectDetentIndex;

/**
 * Imperative commands of a {@link FormSheet}, exposed through its
 * {@link FormSheetProps.ref | ref}.
 *
 * @remarks
 * See {@link SheetCommands} for the available commands.
 */
export type FormSheetCommands = SheetCommands;

/**
 * Cross-platform props for {@link FormSheet}.
 */
export interface FormSheetPropsBase {
  /**
   * Content of the sheet.
   *
   * @platform android, ios, tvos >= 26
   */
  children?: ViewProps['children'] | undefined;

  /**
   * Ref exposing the imperative commands of the sheet.
   *
   * @see {@link FormSheetCommands}
   * @platform android, ios
   */
  ref?: Ref<FormSheetCommands> | undefined;

  /**
   * Determines whether the form sheet is currently visible.
   *
   * @remarks
   * Presentation is driven by state transitions: updating this property from
   * `false` to `true` triggers the sheet to present, while changing it from
   * `true` to `false` triggers a programmatic dismissal.
   *
   * @platform android, ios, tvos >= 26
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
  detents?: FormSheetDetents | undefined;

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
  preferredCornerRadius?: FormSheetPreferredCornerRadius | undefined;

  /**
   * The largest sheet detent for which a view underneath won't be dimmed.
   *
   * @defaultValue `'none'`
   * @platform ios
   */
  largestUndimmedDetentIndex?: FormSheetLargestUndimmedDetentIndex | undefined;

  /**
   * The index of the detent the sheet should snap to when first opened.
   *
   * @remarks
   * This prop only applies when the sheet transitions from closed to open.
   *
   * @defaultValue `0`
   * @platform android, ios
   */
  initialDetentIndex?: FormSheetInitialDetentIndex | undefined;

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
   * Determines whether the sheet stays attached to the bottom edge of the
   * screen in a compact-height environment, such as iPhone in landscape.
   *
   * @remarks
   * When `false`, the sheet fills the screen in a compact-height environment.
   * When `true`, it stays attached to the bottom edge and is as wide as the
   * safe area. It has no effect in a regular-height environment.
   *
   * @defaultValue `false`
   * @see {@link https://developer.apple.com/documentation/uikit/uisheetpresentationcontroller/prefersedgeattachedincompactheight | UISheetPresentationController.prefersEdgeAttachedInCompactHeight}
   * @platform ios
   */
  prefersEdgeAttachedInCompactHeight?: boolean | undefined;

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
   * @platform android, ios, tvos >= 26
   */
  nativeContainerStyle?:
    | StyleProp<FormSheetNativeContainerStyleProps>
    | undefined;

  // Events

  /**
   * A callback that gets invoked when the FormSheet will appear. This is
   * called as soon as the transition begins.
   *
   * @platform android, ios, tvos >= 26
   */
  onWillAppear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * A callback that gets invoked when the sheet did appear. This is called
   * as soon as the transition ends.
   *
   * @platform android, ios, tvos >= 26
   */
  onDidAppear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * A callback that gets invoked when the sheet will disappear. This is
   * called as soon as the transition begins.
   *
   * @platform android, ios, tvos >= 26
   */
  onWillDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * A callback that gets invoked when the sheet did disappear. This is
   * called as soon as the transition ends.
   *
   * @platform android, ios, tvos >= 26
   */
  onDidDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the sheet is dismissed programmatically.
   *
   * @remarks
   * This event is fired when the sheet was dismissed via the `isOpen` prop
   * changing to `false`.
   *
   * @platform android, ios, tvos >= 26
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
   * @platform android, ios, tvos >= 26
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
  onDetentChanged?: NativeEventHandler<FormSheetDetentChangedEvent> | undefined;

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

/**
 * Props for {@link FormSheet}.
 */
export interface FormSheetProps extends FormSheetPropsBase {
  /**
   * iOS-specific props.
   *
   * @platform ios
   */
  ios?: FormSheetPropsIOS | undefined;
}
