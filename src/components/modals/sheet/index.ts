// Module shared by the sheet-style modals. Only the compound types are
// re-exported from the package entry point; `SheetBase` and `SheetProps` stay
// internal.
export type {
  SheetDetentChangedEvent,
  SheetDetents,
  SheetPreferredCornerRadius,
  SheetLargestUndimmedDetentIndex,
  SheetInitialDetentIndex,
  SheetBackgroundEffect,
  SheetBackgroundEffectBlur,
  SheetBackgroundEffectBlurStyle,
  SheetBackgroundEffectColor,
  SheetNativeContainerStyleProps,
  SheetProps,
} from './Sheet.types';

export type { SheetBaseProps, SheetPresentationStyle } from './SheetBase';
export { SheetBase } from './SheetBase';
