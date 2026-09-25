import { expect as jestExpect } from '@jest/globals';
import { by, device, element, expect, waitFor } from 'detox';
import type { ElementAttributeFrame, IosElementAttributes } from 'detox/detox';
import { getMatches, getTopmostMatch } from './matchers';
import { isIOSVersionAtLeast, isIPadTarget } from './platform';
import {
  CLASS_NAME_ANDROID_COORDINATOR_LAYOUT,
  CLASS_NAME_ANDROID_RNS_FORM_SHEET_CONTAINER,
} from './native-classes-android';
import {
  CLASS_NAME_RCT_ROOT_COMPONENT_VIEW,
  CLASS_NAME_RNS_FORM_SHEET_CONTENT_VIEW,
  CLASS_NAME_UI_DIMMING_VIEW,
  CLASS_NAME_UI_DROP_SHADOW_VIEW,
} from './native-classes-ios';

/**
 * Detox can't read the selected detent, so it is inferred from the sheet's
 * visible height as a fraction of a `1.0` detent. Phone only.
 */

export type FormSheetDetentOptions = {
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

export const DEFAULT_TOLERANCE = 0.05;

// UIKit's gap between the largest detent and the top safe area, through iOS 18.
const IOS_SHEET_TOP_GAP = 10;

/** From iOS 26 the sheet is an overlay that reaches the safe area exactly. */
function iosSheetTopGap(): number {
  return isIOSVersionAtLeast('26.0') ? 0 : IOS_SHEET_TOP_GAP;
}

export async function getFormSheetGeometry(): Promise<FormSheetGeometry> {
  const platform = device.getPlatform();
  if (platform === 'ios') {
    if (isIPadTarget) {
      throw new Error(
        'getFormSheetGeometry: iPad presents FormSheet as a floating panel; detent geometry is iPhone-only.',
      );
    }
    return getIOSGeometry();
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

/**
 * Raw screen-space frames; iOS only, iPad included. `window` is the root view's
 * `frame`, which before iOS 26 UIKit scales down behind a sheet at the largest
 * detent -- so it is trustworthy only where that presentation does not happen,
 * i.e. iPad's floating panel. Phone detent math uses {@link getFormSheetGeometry}.
 */
export async function getIOSFormSheetFrames(): Promise<IOSFormSheetFrames> {
  const sheet = await getTopmostMatch(
    by.type(CLASS_NAME_RNS_FORM_SHEET_CONTENT_VIEW),
  );
  const [root] = await getMatches(by.type(CLASS_NAME_RCT_ROOT_COMPONENT_VIEW));
  return { sheet: sheet.frame, window: root.frame };
}

async function getIOSGeometry(): Promise<FormSheetGeometry> {
  const sheet = (await getTopmostMatch(
    by.type(CLASS_NAME_RNS_FORM_SHEET_CONTENT_VIEW),
  )) as IosElementAttributes;
  const [rootMatch] = await getMatches(
    by.type(CLASS_NAME_RCT_ROOT_COMPONENT_VIEW),
  );
  const root = rootMatch as IosElementAttributes;

  // `frame` is in screen space, so it carries any ancestor transform: before
  // iOS 26 UIKit scales the root view down behind a sheet at the largest
  // detent, and from iOS 26 it scales the sheet itself at lower detents.
  // `elementBounds` is in element space, where the transform is already
  // applied and does not distort width/height.
  const visibleHeight = sheet.elementBounds.height;
  const windowHeight = root.elementBounds.height;
  // Bottom-anchored, like the detent fraction itself, so `top + visibleHeight`
  // always equals `windowHeight`. `sheet.frame.y` would break that from iOS 26,
  // where a lower detent is inset on screen but not in its own bounds.
  const top = windowHeight - visibleHeight;
  const maxDetentHeight =
    windowHeight - root.safeAreaInsets.top - iosSheetTopGap();

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
  { tolerance = DEFAULT_TOLERANCE }: FormSheetDetentOptions = {},
): Promise<number> {
  if (detents.length === 0) {
    throw new Error(
      'resolveFormSheetDetentIndex: `detents` must not be empty.',
    );
  }

  const geometry = await getFormSheetGeometry();

  // Android shortens the largest detent by the system insets.
  if (geometry.isAtLargestDetent) {
    return detents.length - 1;
  }

  // A missing geometry attribute yields NaN, which would slip past every
  // comparison below and resolve to index -1 instead of failing.
  if (!Number.isFinite(geometry.fraction)) {
    throw new Error(
      `resolveFormSheetDetentIndex: measured fraction is not a finite number ` +
        `(visible ${geometry.visibleHeight}, window ${geometry.windowHeight}, ` +
        `max ${geometry.maxDetentHeight}).`,
    );
  }

  // The largest detent measures exactly 1.0, so an overshoot means the
  // reference height is wrong -- not that the sheet sits past its top detent.
  if (geometry.fraction > 1 + tolerance) {
    throw new Error(
      `resolveFormSheetDetentIndex: measured fraction ${geometry.fraction.toFixed(
        3,
      )} exceeds 1.0 ` +
        `(top ${geometry.top}, visible ${geometry.visibleHeight}, window ${geometry.windowHeight}, ` +
        `max ${geometry.maxDetentHeight}); the max-detent reference is wrong.`,
    );
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

// ---------------------------------------------------------------------------
// iOS sheet presentation dimming
// ---------------------------------------------------------------------------

const DIMMING_REMOVAL_TIMEOUT_MS = 3000;

const sheetDimmingView = () =>
  element(
    by
      .type(CLASS_NAME_UI_DIMMING_VIEW)
      .withAncestor(by.type(CLASS_NAME_UI_DROP_SHADOW_VIEW)),
  );

/**
 * Asserts the backdrop UIKit inserts behind a presented sheet exists. No-op on
 * Android: the dim is an overlay drawable there, with no view to match.
 */
export async function expectDimmingIfIOS(): Promise<void> {
  if (device.getPlatform() !== 'ios') {
    return;
  }
  await expect(sheetDimmingView()).toExist();
}

/**
 * Asserts the sheet backdrop is gone, waiting out the dismissal animation.
 * No-op on Android, see {@link expectDimmingIfIOS}.
 */
export async function expectNoDimmingIfIOS(): Promise<void> {
  if (device.getPlatform() !== 'ios') {
    return;
  }
  await waitFor(sheetDimmingView())
    .not.toExist()
    .withTimeout(DIMMING_REMOVAL_TIMEOUT_MS);
}
