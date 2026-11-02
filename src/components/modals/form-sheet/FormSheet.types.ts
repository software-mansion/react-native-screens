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
 * Props of the `FormSheet` component.
 *
 * @remarks
 * `FormSheet` presents with `UIModalPresentationFormSheet`. On iPhone it is a
 * full-width sheet anchored to the bottom of the screen. On iPad it is a
 * centered floating panel of a fixed width; the presenting screen is dimmed
 * but not scaled back. Its props are shared with `PageSheet`; the two differ
 * only in iPad layout.
 *
 * tvOS: supported since tvOS 26, where `UIModalPresentationFormSheet` became
 * available. On older tvOS nothing is presented and a warning is logged, as on
 * web.
 */
export type FormSheetProps = SheetProps;
