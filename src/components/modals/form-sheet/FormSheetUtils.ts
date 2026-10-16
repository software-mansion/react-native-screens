import type { FormSheetProps } from './FormSheet.types';

// Predefined value for `fitToContents`. Keep in sync with native counterpart.
const FORM_SHEET_NATIVE_FIT_TO_CONTENTS = -1.0;
// Predefined values for `initialDetentIndex` and `selectDetent`. Keep in sync with native counterpart.
const FORM_SHEET_LAST_DETENT = -1;
// Predefined values for `largestUndimmedDetentIndex`. Keep in sync with native counterpart.
const FORM_SHEET_ALWAYS_DIMMED = -1;
const FORM_SHEET_NEVER_DIMMED = -2;

export function resolveNativeDetents(
  detents?: number[] | 'fitToContents',
): number[] | undefined {
  if (!detents) {
    return undefined;
  }

  if (detents === 'fitToContents') {
    return [FORM_SHEET_NATIVE_FIT_TO_CONTENTS];
  }

  return detents;
}

export function resolveInitialDetentIndex(
  initialDetentIndex: FormSheetProps['initialDetentIndex'],
  detentsCount: number = 0,
): number {
  if (initialDetentIndex === undefined) {
    return 0;
  }

  if (initialDetentIndex === 'last') {
    return FORM_SHEET_LAST_DETENT;
  }

  if (typeof initialDetentIndex === 'number') {
    const lastDetentIndex = Math.max(detentsCount - 1, 0);

    if (!isIndexInClosedRange(initialDetentIndex, 0, lastDetentIndex)) {
      console.error(
        `[RNScreens] Invalid value provided for 'initialDetentIndex' (${initialDetentIndex}). Expected an integer between 0 and ${lastDetentIndex}. Falling back to 0.`,
      );
      return 0;
    }

    return initialDetentIndex;
  }

  console.error(
    "[RNScreens] Invalid value provided for 'initialDetentIndex'. Expected a number or 'last'. Falling back to 0.",
  );
  return 0;
}

/**
 * Resolves the index passed to the `selectDetent` command to a native numeric value.
 *
 * @param index The index passed to the command.
 * @param detentsCount Length of the `detents` array as seen from JS.
 * @returns A value to pass to the native command (`-1` for `last` or a non-negative index),
 * or `undefined` if the index is invalid and the command should be skipped.
 */
export function resolveSelectedDetentIndex(
  index: number | 'last',
  detentsCount: number = 0,
): number | undefined {
  if (index === 'last') {
    return FORM_SHEET_LAST_DETENT;
  }

  const lastDetentIndex = Math.max(detentsCount - 1, 0);

  if (
    typeof index !== 'number' ||
    !isIndexInClosedRange(index, 0, lastDetentIndex)
  ) {
    console.error(
      `[RNScreens] Invalid index provided to 'selectDetent' (${index}). Expected an integer between 0 and ${lastDetentIndex} or 'last'. Ignoring the call.`,
    );
    return undefined;
  }

  return index;
}

export function resolveNativeCornerRadius(
  radius?: number | 'systemDefault',
): number | undefined {
  if (radius === 'systemDefault') {
    return -1.0;
  }
  if (typeof radius === 'number' && radius < 0) {
    return -1.0;
  }

  return radius;
}

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
      console.error(
        `[RNScreens] Invalid value provided for 'largestUndimmedDetentIndex' (${largestUndimmedDetent}). Expected an integer between 0 and ${lastDetentIndex}. Falling back to the default behavior (always dimmed).`,
      );
      return FORM_SHEET_ALWAYS_DIMMED;
    }

    return largestUndimmedDetent;
  }

  console.error(
    "[RNScreens] Invalid value provided for 'largestUndimmedDetentIndex'. Expected a number, 'none', or 'last'. Falling back to the default behavior (always dimmed).",
  );
  return FORM_SHEET_ALWAYS_DIMMED;
}

function isIndexInClosedRange(
  value: number,
  lowerBound: number,
  upperBound: number,
): boolean {
  return Number.isInteger(value) && value >= lowerBound && value <= upperBound;
}
