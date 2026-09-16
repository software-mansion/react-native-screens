import { by, device } from 'detox';
import { expect as jestExpect } from '@jest/globals';
import type { ElementAttributeFrame } from 'detox/detox';
import { getMatches, getTopmostMatch, isIPadTarget } from '../e2e-utils';
import {
  CLASS_NAME_ANDROID_COORDINATOR_LAYOUT,
  CLASS_NAME_ANDROID_RNS_FORM_SHEET_CONTAINER,
  CLASS_NAME_RCT_ROOT_COMPONENT_VIEW,
  CLASS_NAME_RNS_FORM_SHEET_CONTENT_VIEW,
} from '../native-class-names';

/**
 * Detox can't read the selected detent, so it is inferred from the sheet's
 * visible height as a fraction of a `1.0` detent. Phone only.
 */

export type FormSheetGeometryOptions = {
  /** iOS only. Detox can't read it; defaults to iPhone 15/16. */
  topInset?: number;
};

export type FormSheetDetentOptions = FormSheetGeometryOptions & {
  tolerance?: number;
};

export type FormSheetGeometry = {
  top: number;
  visibleHeight: number;
  windowHeight: number;
  maxDetentHeight: number;
  fraction: number;
  /** Android only. */
  isAtLargestDetent?: boolean;
};

export const DEFAULT_IOS_TOP_INSET = 59;
// See `RNSFormSheetDetentResolver`.
const IOS_SHEET_TOP_GAP = 10;
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

export type IOSFormSheetFrames = {
  sheet: ElementAttributeFrame;
  window: ElementAttributeFrame;
};

/** iOS only, iPad included. */
export async function getIOSFormSheetFrames(): Promise<IOSFormSheetFrames> {
  const sheet = await getTopmostMatch(
    by.type(CLASS_NAME_RNS_FORM_SHEET_CONTENT_VIEW),
  );
  const [root] = await getMatches(by.type(CLASS_NAME_RCT_ROOT_COMPONENT_VIEW));
  return { sheet: sheet.frame, window: root.frame };
}

async function getIOSGeometry(topInset: number): Promise<FormSheetGeometry> {
  const { sheet, window } = await getIOSFormSheetFrames();

  const top = sheet.y;
  const visibleHeight = sheet.height;
  const windowHeight = window.height;
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
  const windowBottom = window.frame.y + windowHeight;
  const top = sheet.frame.y;
  const visibleHeight = windowBottom - top;

  return {
    top,
    visibleHeight,
    windowHeight,
    maxDetentHeight: windowHeight,
    fraction: visibleHeight / windowHeight,
    // Sized to the largest detent, so it fits on screen only there.
    isAtLargestDetent: sheet.frame.y + sheet.frame.height <= windowBottom,
  };
}

/** Throws beyond `tolerance`, so a sheet caught mid-animation fails loudly. */
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

  // Android shortens the largest detent by the status bar.
  if (geometry.isAtLargestDetent) {
    return detents.length - 1;
  }

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

export async function expectFormSheetDetentIndex(
  detents: readonly number[],
  expectedIndex: number,
  options?: FormSheetDetentOptions,
): Promise<void> {
  const actualIndex = await resolveFormSheetDetentIndex(detents, options);
  jestExpect(actualIndex).toBe(expectedIndex);
}
