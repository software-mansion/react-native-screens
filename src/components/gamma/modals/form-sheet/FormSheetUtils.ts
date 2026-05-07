import type { FormSheetProps } from './FormSheet.types';

// Keep these predefined values in sync with native equivalents.
const FORM_SHEET_ALWAYS_DIMMED = -1;
const FORM_SHEET_NEVER_DIMMED = -2;

/**
 * Resolves the JS `largestUndimmedDetentIndex` prop to a value the native side
 * can interpret directly.
 *
 * Empty/missing `detents` array maps to a single default detent on iOS, thus effectiveDetentsCount
 * will be always positive value. `'last'` is forwarded to native as a predefined value, because
 * the native side knows how many detents were accepted.
 *
 * @param largestUndimmedDetent The prop value passed from the FormSheet..
 * @param detentsCount Length of the `detents` array as seen from JS.
 * @returns A value to pass to the native component:
 * `-1` (always dimmed),
 * `-2` (never dimmed),
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
    // An empty/missing `detents` array maps to a single large detent on the
    // native side, so the effective count is always positive.
    const effectiveDetentsCount = Math.max(detentsCount, 1);

    if (
      largestUndimmedDetent < 0 ||
      largestUndimmedDetent >= effectiveDetentsCount
    ) {
      if (__DEV__) {
        console.error(
          `[RNScreens] 'largestUndimmedDetentIndex' (${largestUndimmedDetent}) is out of bounds. The sheet has ${effectiveDetentsCount} detent(s). Falling back to the default behavior (always dimmed).`,
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
