import type { FormSheetProps } from './FormSheet.types';

// Keep these predefined values in sync with native equivalents.
const FORM_SHEET_ALWAYS_DIMMED = -1;
const FORM_SHEET_NEVER_DIMMED = -2;

/**
 * Resolves the JS `largestUndimmedDetentIndex` prop to a native numeric value.
 *
 * @param largestUndimmedDetent The prop value passed from the FormSheet.
 * @returns A value to pass to the native component:
 * `-1` (always dimmed),
 * `-2` (never dimmed),
 * - a non-negative index.
 */
export function resolveLargestUndimmedDetentIndex(
  largestUndimmedDetent: FormSheetProps['largestUndimmedDetentIndex'],
): number {
  if (largestUndimmedDetent === 'none' || largestUndimmedDetent === undefined) {
    return FORM_SHEET_ALWAYS_DIMMED;
  }

  if (largestUndimmedDetent === 'last') {
    return FORM_SHEET_NEVER_DIMMED;
  }

  if (typeof largestUndimmedDetent === 'number') {
    return largestUndimmedDetent;
  }

  if (__DEV__) {
    console.error(
      "[RNScreens] Invalid value provided for 'largestUndimmedDetentIndex'. Expected a number, 'none', or 'last'. Falling back to the default behavior (always dimmed).",
    );
  }
  return FORM_SHEET_ALWAYS_DIMMED;
}
