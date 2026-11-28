import type { Ref } from 'react';
import type { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';
import type {
  BlurEffectStyle,
  EmptyEventPayload,
  NativeEventHandler,
} from '../../shared/types';

/**
 * Payload of the `onDetentChanged` event.
 */
export interface SheetDetentChangedEvent {
  /**
   * Zero-based index of the detent the sheet settled at, in `detents`.
   *
   * @platform android, ios
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
 * @remarks
 * Accepts any {@link BlurEffectStyle} value.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uiblureffect/style | UIBlurEffect.Style}
 */
export type SheetBackgroundEffectBlurStyle = BlurEffectStyle;

/**
 * Flat fill rendered behind the sheet's content.
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
 */
export interface SheetBackgroundEffectBlur {
  /**
   * Discriminator of the effect.
   *
   * @platform ios >= 26.1
   */
  type: 'blur';
  /**
   * Blur style of the material.
   *
   * @platform ios >= 26.1
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
   *
   * @platform android, ios, tvos >= 26
   */
  backgroundColor?: ViewStyle['backgroundColor'] | undefined;
};

/**
 * Detent to move a presented sheet to with
 * {@link SheetCommands.selectDetent | selectDetent}.
 *
 * @remarks
 * The following values are supported:
 * - a number — zero-based index of a detent in `detents`.
 * - `'last'` — the last, largest detent.
 */
export type SheetSelectDetentIndex = number | 'last';

/**
 * Imperative commands of a sheet, exposed through its `ref`.
 */
export interface SheetCommands {
  /**
   * Animates the presented sheet to the detent at the given index.
   *
   * @remarks
   * The user can still drag the sheet between all detents afterwards. If the
   * detent differs from the current one, `onDetentChanged` is called with its
   * index, the same as after a user-driven change.
   *
   * The call takes effect once the sheet starts presenting (from
   * `onWillAppear` on) and until it starts dismissing. Calls made outside of
   * that window are ignored. To choose the detent the sheet opens at, use
   * `initialDetentIndex` instead.
   *
   * @param index - Detent to move the sheet to.
   * @platform android, ios
   */
  selectDetent: (index: SheetSelectDetentIndex) => void;
}

// iOS-specific props of `SheetBase`. Internal, like `SheetProps`.
export interface SheetPropsIOS {
  backgroundEffect?: SheetBackgroundEffect | undefined;
}

// Props of `SheetBase`. Internal: each sheet component declares and documents
// its own props, sharing the compound types above.
export interface SheetProps {
  children?: ViewProps['children'] | undefined;
  ref?: Ref<SheetCommands> | undefined;
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
  ios?: SheetPropsIOS | undefined;

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
