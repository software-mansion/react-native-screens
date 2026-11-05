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

export type { EmptyEventPayload } from '../sheet/Sheet.types';

export type FormSheetEventHandler<T> = SheetEventHandler<T>;
export type FormSheetDetentChangedEvent = SheetDetentChangedEvent;
export type FormSheetBackgroundEffectBlurStyle = SheetBackgroundEffectBlurStyle;
export type FormSheetBackgroundEffectColor = SheetBackgroundEffectColor;
export type FormSheetBackgroundEffectBlur = SheetBackgroundEffectBlur;
export type FormSheetBackgroundEffect = SheetBackgroundEffect;
export type FormSheetNativeContainerStyleProps = SheetNativeContainerStyleProps;

/**
 * Props for {@link FormSheet}.
 *
 * @platform android, ios, tvos >= 26
 */
export type FormSheetProps = SheetProps;
