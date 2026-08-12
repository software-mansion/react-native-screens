import { device, expect, element, by, waitFor } from 'detox';
import {
  AndroidElementAttributes,
  IosElementAttributes,
  NativeMatcher,
} from 'detox/detox';
import isVersionEqualOrHigherThan from './helpers/isVersionEqualOrHigherThan';

const { getIOSVersionNumber } = require('../../scripts/e2e/ios-devices.js');

// ---------------------------------------------------------------------------
// Platform & suite gating
// ---------------------------------------------------------------------------

export const describeIfiOS =
  device.getPlatform() === 'ios' ? describe : describe.skip;

export const describeIfAndroid =
  device.getPlatform() === 'android' ? describe : describe.skip;

/**
 * Detox has no runtime idiom query, so this is inferred from the simulator name
 * in `RNS_APPLE_SIM_NAME` (see scripts/e2e/ios-devices.js). iPad suites self-skip
 * on the default iPhone run.
 */
export const isIPadTarget =
  device.getPlatform() === 'ios' &&
  /^iPad\s/i.test(process.env.RNS_APPLE_SIM_NAME ?? '');

export const describeIfiPad = isIPadTarget ? describe : describe.skip;

/** Picks between the legacy and iOS 26 class names in ./native-class-names. */
export function isIOSVersionAtLeast(version: string): boolean {
  return (
    device.getPlatform() === 'ios' &&
    isVersionEqualOrHigherThan(getIOSVersionNumber(), version)
  );
}

// ---------------------------------------------------------------------------
// Matching & attributes
// ---------------------------------------------------------------------------

export type ElementAttributes = IosElementAttributes | AndroidElementAttributes;

type MatchOptions = {
  /**
   * Resolve to no matches instead of throwing. Only where absence is expected —
   * it also swallows a crashed app and a dropped connection.
   */
  orEmpty?: boolean;
};

/**
 * Every element matching `matcher`, normalizing `getAttributes()`'s single- and
 * multi-element shapes into one array ordered by hierarchy (topmost last).
 * Throws on no match, so a crash is not read as "found 0".
 */
export async function getMatches(
  matcher: NativeMatcher,
  { orEmpty = false }: MatchOptions = {},
): Promise<ElementAttributes[]> {
  try {
    const attrs = await element(matcher).getAttributes();
    return 'elements' in attrs ? attrs.elements : [attrs];
  } catch (error) {
    if (orEmpty) {
      return [];
    }
    throw error;
  }
}

/** How many elements `matcher` resolves to; `0` with `orEmpty` and no match. */
export async function countMatches(
  matcher: NativeMatcher,
  options?: MatchOptions,
): Promise<number> {
  return (await getMatches(matcher, options)).length;
}

/**
 * The one element matching `matcher`, throwing if ambiguous. Cast to
 * `IosElementAttributes` / `AndroidElementAttributes` for platform-only fields.
 */
export async function getSingleMatch(
  matcher: NativeMatcher,
): Promise<ElementAttributes> {
  const matches = await getMatches(matcher);

  if (matches.length > 1) {
    throw new Error(
      `Matcher resolved to ${matches.length} elements. Narrow it down, or use ` +
        `getMatches() and pick the one you want explicitly.`,
    );
  }

  return matches[0];
}

/** Screen-coordinate frame of the single element matching `matcher`. */
export async function getFrame(
  matcher: NativeMatcher,
): Promise<{ x: number; y: number; width: number; height: number }> {
  return (await getSingleMatch(matcher)).frame;
}

// ---------------------------------------------------------------------------
// Waiting
// ---------------------------------------------------------------------------

type WaitUntilOptions = {
  /** How long to keep polling before failing, in milliseconds. */
  timeout?: number;
  /** Delay between two `predicate` calls, in milliseconds. */
  interval?: number;
  /** What was awaited, appended to the timeout error. */
  message: string | (() => string);
};

/**
 * Polls `predicate` until it resolves `true`, or fails once `timeout` elapses.
 * Prefer Detox's `waitFor(...).withTimeout(...)`, which syncs with the app; this
 * is for what it cannot express — notably anything about the match *set*, since
 * on Android a transient ambiguous match is terminal.
 */
export async function waitUntil(
  predicate: () => Promise<boolean>,
  { timeout = 3000, interval = 100, message }: WaitUntilOptions,
): Promise<void> {
  const deadline = Date.now() + timeout;

  while (Date.now() <= deadline) {
    if (await predicate()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(
    `waitUntil timed out after ${timeout}ms: ${
      typeof message === 'function' ? message() : message
    }`,
  );
}

// ---------------------------------------------------------------------------
// Scrolling
// ---------------------------------------------------------------------------

export type ScrollOptions = {
  /** Pixels per step. Smaller steps avoid overshooting a short row. */
  pixels?: number;
  /** Swipe start, as a fraction of height. `NaN` leaves it to Detox. */
  startPercentage?: number;
};

export async function scrollUntilVisible(
  id: string,
  scrollViewId: string,
  { pixels = 600, startPercentage = 0.85 }: ScrollOptions = {},
) {
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(pixels, 'down', Number.NaN, startPercentage);
}

/** Rewinds first, so a target above the offset is reachable — `whileElement`
 * only scrolls one way. */
export async function rewindAndScrollUntilVisible(
  id: string,
  scrollViewId: string,
  options: ScrollOptions = {},
) {
  await element(by.id(scrollViewId)).scrollTo('top');
  await scrollUntilVisible(id, scrollViewId, options);
}

// ---------------------------------------------------------------------------
// Tapping
// ---------------------------------------------------------------------------

/**
 * Coordinate-based tap, for an iOS element obstructed by another UI layer —
 * it bypasses Detox's visibility check.
 */
export async function forceTapByLabeliOS(testLabel: string) {
  const { x, y, width, height } = await getFrame(by.label(testLabel));
  await device.tap({
    x: x + width / 2,
    y: y + height / 2,
  });
}

// ---------------------------------------------------------------------------
// Stacked screens
//
// Android keeps covered screens attached, so a matcher can resolve to one
// element per stacked screen. These normalize that to the topmost (last) one.
// ---------------------------------------------------------------------------

/** Attributes of `matcher`'s last match — the topmost stacked screen's copy. */
export async function getTopmostMatch(
  matcher: NativeMatcher,
): Promise<ElementAttributes> {
  const matches = await getMatches(matcher);
  return matches[matches.length - 1];
}

/** Reads the trimmed text of `testID` on the topmost stacked screen. */
export async function readTopmostText(testID: string): Promise<string> {
  const topmost = await getTopmostMatch(by.id(testID));
  return (topmost.text ?? topmost.label ?? '').trim();
}

/**
 * Taps `matcher`'s last match. Pass a freshly built matcher: `atIndex` rewrites
 * it in place, so a reused one stays pinned to the index tapped here.
 */
export async function tapTopmost(matcher: NativeMatcher): Promise<void> {
  await element(matcher)
    .atIndex((await countMatches(matcher)) - 1)
    .tap();
}

/** Taps the button labelled `title` on the topmost stacked screen. */
export async function tapTopmostButton(title: string): Promise<void> {
  await tapTopmost(by.text(title));
}

/**
 * Only "nothing matched yet" / "not visible yet" are worth retrying; anything
 * else must surface as itself, not as a settle timeout. Both platforms' wordings
 * are listed — dropping either turns an unrendered screen into a hard failure on
 * that platform alone.
 */
function isTransientMatchError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('No views in hierarchy found matching') ||
    message.includes('No elements found for') ||
    message.includes('not visible')
  );
}

/**
 * Asserts `matcher`'s topmost match is visible. Indexed because a bare
 * `toBeVisible()` throws "matches N views" once several screens are attached;
 * polled because header chrome can lag the content and `getMatches` throws on
 * the transient 0-match state.
 *
 * Only for elements expected to be present — absence burns the full timeout;
 * use `not.toExist()` instead.
 */
export async function expectTopmostVisible(
  matcher: NativeMatcher,
  timeout = 3000,
): Promise<void> {
  let lastError: unknown = '<never attempted>';

  await waitUntil(
    async () => {
      try {
        await expect(
          element(matcher).atIndex((await countMatches(matcher)) - 1),
        ).toBeVisible();
        return true;
      } catch (error) {
        if (!isTransientMatchError(error)) {
          throw error;
        }
        lastError = error;
        return false;
      }
    },
    {
      timeout,
      message: () =>
        `the topmost match to be visible; last failure: ${lastError}`,
    },
  );
}
