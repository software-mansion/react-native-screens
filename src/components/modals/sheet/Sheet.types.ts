import type { ColorValue, NativeSyntheticEvent, ViewProps } from 'react-native';
import type { BlurEffect } from '../../shared/types';

/**
 * Payload of a sheet event that carries no data.
 *
 * @platform android, ios >= 15, tvos >= 26
 */
export type EmptyEventPayload = Record<string, never>;

/**
 * Handler of a sheet event.
 *
 * @typeParam T - Payload the native event carries.
 * @param e - The native event.
 * @platform android, ios >= 15, tvos >= 26
 */
export type SheetEventHandler<T> = (e: NativeSyntheticEvent<T>) => void;

/**
 * Payload of the event sent when the sheet settles at a new detent.
 *
 * @platform android, ios >= 15
 */
export interface SheetDetentChangedEvent {
  /**
   * Index of the new detent in the `detents` array.
   *
   * @platform android, ios >= 15
   */
  index: number;
}

/**
 * `UIBlurEffect.Style` a {@link SheetBackgroundEffectBlur} is rendered with.
 *
 * @remarks
 * Accepts any {@link BlurEffect} value except `'none'`.
 *
 * @platform ios >= 26.1
 */
export type SheetBackgroundEffectBlurStyle = Exclude<BlurEffect, 'none'>;

/**
 * Flat fill rendered behind the sheet's content.
 *
 * @platform ios >= 26.1
 */
export interface SheetBackgroundEffectColor {
  /**
   * Discriminator of the effect.
   *
   * @platform ios >= 26.1
   */
  type: 'color';
  /**
   * Color of the fill.
   *
   * @platform ios >= 26.1
   */
  color: ColorValue;
}

/**
 * Blur material rendered behind the sheet's content.
 *
 * @platform ios >= 26.1
 */
export interface SheetBackgroundEffectBlur {
  /**
   * Discriminator of the effect.
   *
   * @platform ios >= 26.1
   */
  type: 'blur';
  /**
   * `UIBlurEffect.Style` the material is rendered with.
   *
   * @platform ios >= 26.1
   */
  style: SheetBackgroundEffectBlurStyle;
}

/**
 * Material the system renders behind the sheet's content.
 *
 * The following values are supported:
 * - `'automatic'` — whatever UIKit uses for sheets on the current iOS
 *   version.
 * - `'none'` — no material at all; the sheet is transparent and only its
 *   content is drawn.
 * - {@link SheetBackgroundEffectColor} — a flat fill (`UIColorEffect`).
 * - {@link SheetBackgroundEffectBlur} — a `UIBlurEffect` with the given
 *   `UIBlurEffect.Style`.
 *
 * @platform ios >= 26.1
 */
export type SheetBackgroundEffect =
  | 'automatic'
  | 'none'
  | SheetBackgroundEffectColor
  | SheetBackgroundEffectBlur;

/**
 * Style of the native container hosting the sheet content.
 *
 * @platform android, ios >= 15, tvos >= 26
 */
export type SheetNativeContainerStyleProps = {
  /**
   * Background color of the native container hosting the sheet content.
   *
   * @platform android, ios >= 15, tvos >= 26
   */
  backgroundColor?: ColorValue | undefined;
};

/**
 * Props shared by the sheet components, {@link FormSheet} and
 * {@link PageSheet}.
 *
 * @platform android, ios >= 15, tvos >= 26
 */
export interface SheetProps {
  /**
   * Content of the sheet.
   *
   * @platform android, ios >= 15, tvos >= 26
   */
  children?: ViewProps['children'] | undefined;

  /**
   * Determines whether the sheet is currently visible.
   *
   * @remarks
   * Presentation is driven by state transitions: changing this property from
   * `false` to `true` presents the sheet, and changing it from `true` to
   * `false` dismisses it programmatically.
   *
   * @platform android, ios >= 15, tvos >= 26
   */
  isOpen: boolean;

  /**
   * Resting positions of the sheet.
   *
   * @remarks
   * Either an array of fractional screen heights (from `0.0` to `1.0`) or
   * `'fitToContents'`:
   * - Fractional heights — the sheet snaps to these height proportions.
   * - `'fitToContents'` — the sheet calculates its height to wrap its content
   *   and animates to follow any layout changes of the content.
   *
   * On iOS, these map directly to `UISheetPresentationController` detents.
   * An empty array results in a single large detent.
   *
   * @note
   * On iOS 15, `'fitToContents'` falls back to a medium detent.
   *
   * @platform android, ios >= 15
   */
  detents?: number[] | 'fitToContents' | undefined;

  /**
   * Determines whether the sheet requests a grabber at the top.
   *
   * @remarks
   * When `true`, the sheet requests a small grabber indicator at the top to
   * hint that the sheet can be resized. The system may still hide the grabber
   * in some presentation contexts.
   *
   * @defaultValue `false`
   * @platform android, ios >= 15
   */
  prefersGrabberVisible?: boolean | undefined;

  /**
   * Corner radius the sheet attempts to present with.
   *
   * @remarks
   * `'systemDefault'` or a negative number uses the system's automatic
   * dimension (`UISheetPresentationControllerAutomaticDimension`).
   *
   * @info
   * On older Android versions the prop is ignored, because clipping the sheet
   * content to non-uniform rounded corners is not reliable there.
   *
   * @defaultValue `'systemDefault'`
   * @platform android >= 33, ios >= 15
   */
  preferredCornerRadius?: number | 'systemDefault' | undefined;

  /**
   * Largest detent for which the view underneath the sheet is not dimmed.
   *
   * @remarks
   * A number is the index of the detent in the `detents` array. Additionally:
   * - `'none'` — the view underneath is dimmed for every detent.
   * - `'last'` — the view underneath is not dimmed for any detent.
   *
   * @defaultValue `'none'`
   * @platform ios >= 15
   */
  largestUndimmedDetentIndex?: number | 'none' | 'last' | undefined;

  /**
   * Index of the detent the sheet snaps to when first opened.
   *
   * @remarks
   * A number is the zero-based index of the detent in the `detents` array;
   * `'last'` selects the largest detent. The prop applies only when the sheet
   * transitions from closed to open.
   *
   * @defaultValue `0`
   * @platform ios >= 15
   */
  initialDetentIndex?: number | 'last' | undefined;

  /**
   * Determines whether scrolling expands the sheet to a larger detent.
   *
   * @remarks
   * When `true`, scrolling up within a child scroll view (starting from the top
   * edge) first expands the sheet to a larger detent and only then scrolls the
   * content. When `false`, the child scroll view scrolls its content without
   * expanding the sheet. Dragging the sheet's non-scrollable area expands the
   * sheet regardless of this setting.
   *
   * On iOS, this maps directly to
   * `UISheetPresentationController.prefersScrollingExpandsWhenScrolledToEdge`.
   *
   * @defaultValue `true`
   * @platform ios >= 15
   */
  prefersScrollingExpandsWhenScrolledToEdge?: boolean | undefined;

  /**
   * Prevents the user from dismissing the sheet natively.
   *
   * @remarks
   * When `true`, the sheet resists the swipe-down gesture and the backdrop tap
   * and stays at its resting detent. Dismissing the sheet programmatically with
   * `isOpen={false}` still works.
   *
   * @defaultValue `false`
   * @see {@link SheetProps.onNativeDismissPrevented | onNativeDismissPrevented}
   * @platform android, ios >= 15, tvos >= 26
   */
  preventNativeDismiss?: boolean | undefined;

  /**
   * Style applied to the native container hosting the sheet content.
   *
   * @remarks
   * These properties are forwarded directly to the underlying native view.
   *
   * @platform android, ios >= 15, tvos >= 26
   */
  nativeContainerStyle?: SheetNativeContainerStyleProps | undefined;

  /**
   * Material the system renders behind the sheet's content.
   *
   * @remarks
   * The material is drawn behind the native container, so an opaque
   * `nativeContainerStyle.backgroundColor` covers it. Replacing the material
   * still matters then, because it removes the Liquid Glass highlight and
   * edges of `'automatic'`.
   *
   * On iOS, this maps to `UIPresentationController.backgroundEffect`.
   *
   * @defaultValue `'automatic'`
   * @platform ios >= 26.1
   */
  backgroundEffect?: SheetBackgroundEffect | undefined;

  // Events

  /**
   * Called when the sheet is about to appear.
   *
   * @remarks
   * Called as soon as the transition begins.
   *
   * @platform android, ios >= 15, tvos >= 26
   */
  onWillAppear?: SheetEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the sheet has appeared.
   *
   * @remarks
   * Called as soon as the transition ends.
   *
   * @platform android, ios >= 15, tvos >= 26
   */
  onDidAppear?: SheetEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the sheet is about to disappear.
   *
   * @remarks
   * Called as soon as the transition begins.
   *
   * @platform android, ios >= 15, tvos >= 26
   */
  onWillDisappear?: SheetEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the sheet has disappeared.
   *
   * @remarks
   * Called as soon as the transition ends.
   *
   * @platform android, ios >= 15, tvos >= 26
   */
  onDidDisappear?: SheetEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the sheet is dismissed programmatically.
   *
   * @remarks
   * Fired when the sheet is dismissed because `isOpen` changed to `false`.
   *
   * @platform android, ios >= 15, tvos >= 26
   */
  onDismiss?: SheetEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the sheet is dismissed natively.
   *
   * @tip
   * Use this callback to synchronize your React state with the native one,
   * for example to set `isOpen` back to `false`. Otherwise the two can get
   * out of sync.
   *
   * @platform android, ios >= 15, tvos >= 26
   */
  onNativeDismiss?: SheetEventHandler<EmptyEventPayload> | undefined;

  /**
   * Called when the sheet settles at a new detent.
   *
   * @remarks
   * The event carries the `index` of the new detent in the `detents` array.
   *
   * @platform android, ios >= 15
   */
  onDetentChanged?: SheetEventHandler<SheetDetentChangedEvent> | undefined;

  /**
   * Called when the user attempts to dismiss the sheet natively, but the
   * dismissal is prevented.
   *
   * @remarks
   * Fired only when `preventNativeDismiss` is `true`, after a swipe-down or
   * a backdrop tap. Useful for custom feedback, such as an alert telling the
   * user why the sheet cannot be closed.
   *
   * @see {@link SheetProps.preventNativeDismiss | preventNativeDismiss}
   * @platform android, ios >= 15, tvos >= 26
   */
  onNativeDismissPrevented?: SheetEventHandler<EmptyEventPayload> | undefined;
}
