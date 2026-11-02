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
 * Props of the `PageSheet` component.
 *
 * @remarks
 * `PageSheet` presents with `UIModalPresentationPageSheet`. On iPhone it is
 * indistinguishable from `FormSheet`: a full-width sheet anchored to the
 * bottom of the screen. On iPad it is a wide, bottom-anchored card and the
 * presenting screen is dimmed and scaled back behind it, where `FormSheet`
 * shows a small centered panel. On Android both components present the same
 * bottom sheet dialog. Its props are shared with `FormSheet`.
 *
 * tvOS: not supported. `UIModalPresentationPageSheet` is unavailable there, so
 * nothing is presented and a warning is logged, as on web.
 */
export type PageSheetProps = SheetProps;
