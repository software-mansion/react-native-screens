import type {
  SheetBackgroundEffect,
  SheetBackgroundEffectBlur,
  SheetBackgroundEffectBlurStyle,
  SheetBackgroundEffectColor,
  SheetDetentChangedEvent,
  SheetEventHandler,
  SheetNativeContainerStyleProps,
  SheetProps,
} from '../sheet/Sheet.types';

export type PageSheetEventHandler<T> = SheetEventHandler<T>;
export type PageSheetDetentChangedEvent = SheetDetentChangedEvent;
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
