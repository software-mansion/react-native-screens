import { by, device } from 'detox';
import { expect as jestExpect } from '@jest/globals';
import { getMatches, getTopmostMatch, isIPadTarget } from '../e2e-utils';
import {
  CLASS_NAME_ANDROID_COORDINATOR_LAYOUT,
  CLASS_NAME_ANDROID_RNS_FORM_SHEET_CONTAINER,
  CLASS_NAME_RCT_ROOT_COMPONENT_VIEW,
  CLASS_NAME_RNS_FORM_SHEET_CONTENT_VIEW,
} from '../native-class-names';

/**
 * Geometry-based detent detection for `FormSheet`. Neither platform exposes
 * the selected detent to Detox, so it is inferred from the sheet's visible
 * height relative to the height a `1.0` detent resolves to:
 *
 * - iOS: `RNSFormSheetContentView` is sized by UIKit to the current detent.
 *   Fractions resolve against `maximumDetentValue` = window height minus top
 *   safe-area inset minus a 10 pt gap (see `RNSFormSheetDetentResolver`).
 * - Android: `FormSheetContainer`'s screen `y` is the sheet's top edge and
 *   fractions resolve against the dialog window, i.e. its `CoordinatorLayout`
 *   (see `FormSheetDetents`). Only the focused dialog window is matchable, so
 *   stacked sheets always measure the topmost one.
 *
 * iPhone / Android phone only; iPad presents a floating panel. `fitToContents`
 * has no fraction to resolve — use {@link getFormSheetGeometry} and compare
 * heights directly.
 */

export type FormSheetGeometryOptions = {
  /**
   * iOS only: top safe-area inset in points. Detox cannot read it, so it
   * defaults to the iPhone 15/16 family value; pass it for other devices.
   */
  topInset?: number;
};

export type FormSheetDetentOptions = FormSheetGeometryOptions & {
  /** Max distance from the closest detent before resolution fails. */
  tolerance?: number;
};

export type FormSheetGeometry = {
  /** Screen `y` of the sheet's top edge. */
  top: number;
  /** Height of the on-screen part of the sheet. */
  visibleHeight: number;
  windowHeight: number;
  /** Height a `1.0` detent resolves to on this platform. */
  maxDetentHeight: number;
  /** `visibleHeight / maxDetentHeight`, comparable to a `detents` entry. */
  fraction: number;
};

export const DEFAULT_IOS_TOP_INSET = 59;
const IOS_SHEET_TOP_GAP = 10;
/**
 * Fraction of the max detent height. Absorbs the top-inset estimate error on
 * iOS as long as detents are at least ~0.1 apart.
 */
export const DEFAULT_TOLERANCE = 0.05;

export async function getFormSheetGeometry({
  topInset = DEFAULT_IOS_TOP_INSET,
}: FormSheetGeometryOptions = {}): Promise<FormSheetGeometry> {
  const platform = device.getPlatform();
  if (platform === 'ios') {
    if (isIPadTarget) {
      throw new Error(
        'getFormSheetGeometry: iPad presents FormSheet as a floating panel; detent geometry is iPhone-only.',
      );
    }
    return getIOSGeometry(topInset);
  }
  if (platform === 'android') {
    return getAndroidGeometry();
  }
  throw new Error(`Platform "${platform}" not supported`);
}

async function getIOSGeometry(topInset: number): Promise<FormSheetGeometry> {
  const sheet = await getTopmostMatch(
    by.type(CLASS_NAME_RNS_FORM_SHEET_CONTENT_VIEW),
  );
  const [root] = await getMatches(by.type(CLASS_NAME_RCT_ROOT_COMPONENT_VIEW));

  const top = sheet.frame.y;
  const visibleHeight = sheet.frame.height;
  const windowHeight = root.frame.height;
  const maxDetentHeight = windowHeight - topInset - IOS_SHEET_TOP_GAP;

  return {
    top,
    visibleHeight,
    windowHeight,
    maxDetentHeight,
    fraction: visibleHeight / maxDetentHeight,
  };
}

async function getAndroidGeometry(): Promise<FormSheetGeometry> {
  const [sheet] = await getMatches(
    by.type(CLASS_NAME_ANDROID_RNS_FORM_SHEET_CONTAINER),
  );
  const [window] = await getMatches(
    by
      .type(CLASS_NAME_ANDROID_COORDINATOR_LAYOUT)
      .withDescendant(by.type(CLASS_NAME_ANDROID_RNS_FORM_SHEET_CONTAINER)),
  );

  const windowHeight = window.frame.height;
  const top = sheet.frame.y;
  const visibleHeight = window.frame.y + windowHeight - top;

  return {
    top,
    visibleHeight,
    windowHeight,
    maxDetentHeight: windowHeight,
    fraction: visibleHeight / windowHeight,
  };
}

/**
 * Index into `detents` (the fractional array passed to the component) of the
 * detent the sheet currently sits at. Throws if the closest detent is further
 * than `tolerance` away, so a sheet caught mid-animation fails loudly instead
 * of resolving to a neighbor.
 */
export async function resolveFormSheetDetentIndex(
  detents: readonly number[],
  {
    tolerance = DEFAULT_TOLERANCE,
    ...geometryOptions
  }: FormSheetDetentOptions = {},
): Promise<number> {
  if (detents.length === 0) {
    throw new Error(
      'resolveFormSheetDetentIndex: `detents` must not be empty.',
    );
  }

  const geometry = await getFormSheetGeometry(geometryOptions);

  const distances = detents.map(detent => Math.abs(detent - geometry.fraction));
  const closestDistance = Math.min(...distances);
  const closestIndex = distances.indexOf(closestDistance);

  if (closestDistance > tolerance) {
    throw new Error(
      `resolveFormSheetDetentIndex: measured fraction ${geometry.fraction.toFixed(
        3,
      )} ` +
        `(top ${geometry.top}, visible ${geometry.visibleHeight}, max ${geometry.maxDetentHeight}) ` +
        `is ${closestDistance.toFixed(3)} away from the closest detent ${
          detents[closestIndex]
        } ` +
        `at index ${closestIndex}; tolerance is ${tolerance}.`,
    );
  }
  return closestIndex;
}

/** Asserts the presented sheet sits at `detents[expectedIndex]`. */
export async function expectFormSheetDetentIndex(
  detents: readonly number[],
  expectedIndex: number,
  options?: FormSheetDetentOptions,
): Promise<void> {
  const actualIndex = await resolveFormSheetDetentIndex(detents, options);
  jestExpect(actualIndex).toBe(expectedIndex);
}
