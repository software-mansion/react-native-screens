import type {
  SheetBackgroundEffect,
  SheetBackgroundEffectBlur,
  SheetBackgroundEffectBlurStyle,
  SheetBackgroundEffectColor,
  SheetDetentChangedEvent,
  SheetDetents,
  SheetInitialDetentIndex,
  SheetLargestUndimmedDetentIndex,
  SheetNativeContainerStyleProps,
  SheetPreferredCornerRadius,
  SheetProps,
} from '../sheet/Sheet.types';

export type PageSheetDetentChangedEvent = SheetDetentChangedEvent;
export type PageSheetDetents = SheetDetents;
export type PageSheetPreferredCornerRadius = SheetPreferredCornerRadius;
export type PageSheetLargestUndimmedDetentIndex =
  SheetLargestUndimmedDetentIndex;
export type PageSheetInitialDetentIndex = SheetInitialDetentIndex;
export type PageSheetBackgroundEffectBlurStyle = SheetBackgroundEffectBlurStyle;
export type PageSheetBackgroundEffectColor = SheetBackgroundEffectColor;
export type PageSheetBackgroundEffectBlur = SheetBackgroundEffectBlur;
export type PageSheetBackgroundEffect = SheetBackgroundEffect;
export type PageSheetNativeContainerStyleProps = SheetNativeContainerStyleProps;

/**
 * Props for {@link PageSheet}.
 *
 * @platform android >= 21, ios >= 15
 */
export type PageSheetProps = SheetProps;
