import type { SheetProps } from '../sheet';

// Renamed re-exports keep the shared declarations' typedocs visible on the
// consumer side.
export type {
  SheetDetentChangedEvent as FormSheetDetentChangedEvent,
  SheetDetents as FormSheetDetents,
  SheetPreferredCornerRadius as FormSheetPreferredCornerRadius,
  SheetLargestUndimmedDetentIndex as FormSheetLargestUndimmedDetentIndex,
  SheetInitialDetentIndex as FormSheetInitialDetentIndex,
  SheetBackgroundEffectBlurStyle as FormSheetBackgroundEffectBlurStyle,
  SheetBackgroundEffectColor as FormSheetBackgroundEffectColor,
  SheetBackgroundEffectBlur as FormSheetBackgroundEffectBlur,
  SheetBackgroundEffect as FormSheetBackgroundEffect,
  SheetNativeContainerStyleProps as FormSheetNativeContainerStyleProps,
} from '../sheet';

/**
 * Props for {@link FormSheet}.
 */
// An interface so that TS errors name `FormSheetProps`.
export interface FormSheetProps extends SheetProps {}
