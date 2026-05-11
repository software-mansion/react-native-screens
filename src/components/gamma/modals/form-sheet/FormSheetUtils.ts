import type { FormSheetProps } from './FormSheet.types';

// Keep these predefined values in sync with native equivalents.
const FORM_SHEET_ALWAYS_DIMMED = -1;
const FORM_SHEET_NEVER_DIMMED = -2;

/**
 * Resolves the JS `largestUndimmedDetentIndex` prop to a native numeric value.
 *
 * @param largestUndimmedDetent The prop value passed from the FormSheet.
 * @param detentsCount Length of the `detents` array as seen from JS.
 * @returns A value to pass to the native component:
 * - `-1` (`FORM_SHEET_ALWAYS_DIMMED`),
 * - `-2` (`FORM_SHEET_NEVER_DIMMED`),
 * - a non-negative index.
 */
export function resolveLargestUndimmedDetentIndex(
  largestUndimmedDetent: FormSheetProps['largestUndimmedDetentIndex'],
  detentsCount: number = 0,
): number {
  if (largestUndimmedDetent === 'none' || largestUndimmedDetent === undefined) {
    return FORM_SHEET_ALWAYS_DIMMED;
  }

  if (largestUndimmedDetent === 'last') {
    return FORM_SHEET_NEVER_DIMMED;
  }

  if (typeof largestUndimmedDetent === 'number') {
    const lastDetentIndex = Math.max(detentsCount - 1, 0);

    if (!isIndexInClosedRange(largestUndimmedDetent, 0, lastDetentIndex)) {
      if (__DEV__) {
        console.error(
          `[RNScreens] Invalid value provided for 'largestUndimmedDetentIndex' (${largestUndimmedDetent}). Expected an integer between 0 and ${lastDetentIndex}. Falling back to the default behavior (always dimmed).`,
        );
      }
      return FORM_SHEET_ALWAYS_DIMMED;
    }

    return largestUndimmedDetent;
  }

  if (__DEV__) {
    console.error(
      "[RNScreens] Invalid value provided for 'largestUndimmedDetentIndex'. Expected a number, 'none', or 'last'. Falling back to the default behavior (always dimmed).",
    );
  }
  return FORM_SHEET_ALWAYS_DIMMED;
}

function isIndexInClosedRange(
  value: number,
  lowerBound: number,
  upperBound: number,
): boolean {
  return Number.isInteger(value) && value >= lowerBound && value <= upperBound;
}
