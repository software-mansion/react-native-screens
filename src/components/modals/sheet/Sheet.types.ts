import type { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';
import type {
  BlurEffect,
  EmptyEventPayload,
  NativeEventHandler,
} from '../../shared/types';

/**
 * Payload of the `onDetentChanged` event.
 */
export interface SheetDetentChangedEvent {
  /**
   * Zero-based index of the detent the sheet settled at, in `detents`.
   */
  index: number;
}

/**
 * Resting positions of a sheet.
 *
 * @remarks
 * The following values are supported:
 * - an array of fractions of the sheet's maximum height, each between `0.0`
 *   and `1.0`, in strictly ascending order — the sheet rests at each of them.
 * - `'fitToContents'` — a single detent with the height of the sheet's
 *   content.
 */
export type SheetDetents = number[] | 'fitToContents';

/**
 * Corner radius of a sheet.
 *
 * @remarks
 * The following values are supported:
 * - a number — the radius in density-independent pixels.
 * - `'systemDefault'` — the system's default corner radius.
 */
export type SheetPreferredCornerRadius = number | 'systemDefault';

/**
 * Largest detent of a sheet at which the content underneath is not dimmed.
 *
 * @remarks
 * The following values are supported:
 * - a number — zero-based index of a detent in `detents`; the content
 *   underneath is dimmed only at the detents above it.
 * - `'none'` — the content underneath is dimmed at every detent.
 * - `'last'` — the content underneath is never dimmed.
 */
export type SheetLargestUndimmedDetentIndex = number | 'none' | 'last';

/**
 * Detent a sheet opens at.
 *
 * @remarks
 * The following values are supported:
 * - a number — zero-based index of a detent in `detents`.
 * - `'last'` — the last, largest detent.
 */
export type SheetInitialDetentIndex = number | 'last';

/**
 * Blur style of a {@link SheetBackgroundEffectBlur}.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uiblureffect/style | UIBlurEffect.Style}
 */
export type SheetBackgroundEffectBlurStyle = Exclude<BlurEffect, 'none'>;

/**
 * Flat fill rendered behind the sheet's content.
 */
export interface SheetBackgroundEffectColor {
  /**
   * Discriminator of the effect.
   */
  type: 'color';
  /**
   * Color of the fill.
   */
  color: ColorValue;
}

/**
 * Blur material rendered behind the sheet's content.
 */
export interface SheetBackgroundEffectBlur {
  /**
   * Discriminator of the effect.
   */
  type: 'blur';
  /**
   * Blur style of the material.
   */
  style: SheetBackgroundEffectBlurStyle;
}

/**
 * Material the system renders behind the sheet's content.
 *
 * @remarks
 * The following values are supported:
 * - `'automatic'` — the system's default material for sheets.
 * - `'none'` — no material at all; the sheet is transparent and only its
 *   content is drawn.
 * - {@link SheetBackgroundEffectColor} — a flat fill of the given color.
 * - {@link SheetBackgroundEffectBlur} — a blur of the given style.
 */
export type SheetBackgroundEffect =
  | 'automatic'
  | 'none'
  | SheetBackgroundEffectColor
  | SheetBackgroundEffectBlur;

/**
 * Style of the native container hosting a sheet's content.
 */
export type SheetNativeContainerStyleProps = {
  /**
   * Specifies the background color of the native container hosting the sheet
   * content.
   */
  backgroundColor?: ViewStyle['backgroundColor'] | undefined;
};

// Props of `SheetBase`. Internal: each sheet component declares and documents
// its own props, sharing the compound types above.
export interface SheetProps {
  children?: ViewProps['children'] | undefined;
  isOpen: boolean;
  detents?: SheetDetents | undefined;
  prefersGrabberVisible?: boolean | undefined;
  preferredCornerRadius?: SheetPreferredCornerRadius | undefined;
  largestUndimmedDetentIndex?: SheetLargestUndimmedDetentIndex | undefined;
  initialDetentIndex?: SheetInitialDetentIndex | undefined;
  prefersScrollingExpandsWhenScrolledToEdge?: boolean | undefined;
  prefersEdgeAttachedInCompactHeight?: boolean | undefined;
  preventNativeDismiss?: boolean | undefined;
  nativeContainerStyle?: StyleProp<SheetNativeContainerStyleProps> | undefined;
  backgroundEffect?: SheetBackgroundEffect | undefined;

  // Events
  onWillAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  onDidAppear?: NativeEventHandler<EmptyEventPayload> | undefined;
  onWillDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
  onDidDisappear?: NativeEventHandler<EmptyEventPayload> | undefined;
  onDismiss?: NativeEventHandler<EmptyEventPayload> | undefined;
  onNativeDismiss?: NativeEventHandler<EmptyEventPayload> | undefined;
  onDetentChanged?: NativeEventHandler<SheetDetentChangedEvent> | undefined;
  onNativeDismissPrevented?: NativeEventHandler<EmptyEventPayload> | undefined;
}
