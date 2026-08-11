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
 * Detox exposes no runtime UIUserInterfaceIdiom query, so the idiom is inferred
 * from the simulator name requested via `RNS_APPLE_SIM_NAME` (see
 * scripts/e2e/ios-devices.js). iPad-only suites self-skip on the default iPhone
 * run and execute only with e.g. RNS_APPLE_SIM_NAME="iPad Pro 13-inch (M4)".
 */
export const isIPadTarget =
  device.getPlatform() === 'ios' &&
  /^iPad\s/i.test(process.env.RNS_APPLE_SIM_NAME ?? '');

export const describeIfiPad = isIPadTarget ? describe : describe.skip;

/**
 * True when running on iOS at `version` or newer. Use it to pick between the
 * legacy and iOS 26 variants of the private UIKit class names in
 * ./native-class-names.
 */
export function isIOSVersionAtLeast(version: string): boolean {
  return (
    device.getPlatform() === 'ios' &&
    isVersionEqualOrHigherThan(getIOSVersionNumber(), version)
  );
}

// ---------------------------------------------------------------------------
// Element attributes
// ---------------------------------------------------------------------------

export type ElementAttributes = IosElementAttributes | AndroidElementAttributes;

type MatchOptions = {
  /**
   * Resolve to no matches instead of throwing. Pass only where absence is an
   * expected state — it also swallows a crashed app and a dropped connection.
   */
  orEmpty?: boolean;
};

/**
 * Every element matching `matcher`, normalizing `getAttributes()`'s single- and
 * multi-element shapes into one array ordered by view hierarchy (topmost
 * stacked screen last). Throws on no match, so a crash is not read as "found 0".
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
 * Returns the attributes of the one element matching `matcher`, throwing if the
 * matcher is ambiguous. Cast the result to `IosElementAttributes` /
 * `AndroidElementAttributes` at the call site when you need platform-specific
 * fields.
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

/**
 * The screen-coordinate frame of the single element matching `matcher`.
 * Throws when the matcher is ambiguous — pass a narrower one, or read
 * `getMatches()` and pick the element you mean.
 */
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
  /** What was awaited, appended to the timeout error. A function can build it
   * from whatever the last `predicate` call observed. */
  message: string | (() => string);
};

/**
 * Polls `predicate` until it resolves `true`, or fails once `timeout` elapses.
 * Prefer Detox's `waitFor(...).withTimeout(...)`, which syncs with the app
 * instead of sampling it; this is for conditions it cannot express — notably
 * anything about the match *set*, since on Android `waitFor` retries natively
 * against a single view and a transient ambiguous match is terminal.
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
// Interactions
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

/**
 * Rewinds to the top first, so a target above the current offset is still
 * reachable — `whileElement` only scrolls one way.
 */
export async function rewindAndScrollUntilVisible(
  id: string,
  scrollViewId: string,
  options: ScrollOptions = {},
) {
  await element(by.id(scrollViewId)).scrollTo('top');
  await scrollUntilVisible(id, scrollViewId, options);
}

/**
 * Performs a coordinate-based tap on iOS to interact with an element that may be
 * obstructed by other UI layers, bypassing Detox's default visibility checks.
 */
export async function forceTapByLabeliOS(testLabel: string) {
  const { x, y, width, height } = await getFrame(by.label(testLabel));
  await device.tap({
    x: x + width / 2,
    y: y + height / 2,
  });
}

export async function forceSelectTabByLabel(label: string) {
  if (device.getPlatform() === 'ios') {
    await forceTapByLabeliOS(label);
  } else {
    await element(by.label(label)).tap();
  }
}

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------

/** Waits for the toast labelled `message`, then taps it to dismiss it. */
export async function dismissToast(message: string) {
  await waitFor(element(by.label(message)))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.label(message)).tap();
}

/** Dismisses the head of the toast queue — always `1.` if each is dismissed. */
export async function dismissNextToast(message: string) {
  await dismissToast(`1. ${message}`);
}

/**
 * Detox matches a regex against the *whole* string — without the trailing `.*`
 * this matches nothing and always passes.
 */
export async function expectNoToast() {
  await expect(element(by.label(/\d+\. .*/))).not.toExist();
}

// ---------------------------------------------------------------------------
// Settings controls
// ---------------------------------------------------------------------------

/**
 * The `testID` `SettingsPicker` gives one of its option rows.
 *
 * This mirrors the expression in the component, so a picker's `label` prop and
 * its option ids stay in step. Hardcoding the derived id in a test instead
 * makes a later `label` rename fail at runtime with no compile error.
 *
 * @see apps/src/shared/SettingsPicker.tsx
 */
export function pickerOptionId(label: string, option: string): string {
  return `${label.split(' ').join('-')}-${option}`.toLowerCase();
}

/** Pass when the control or its rows can sit outside the viewport. */
export type SettingsControlOptions = ScrollOptions & { scrollViewId: string };

export type PickerSelection = {
  pickerId: string;
  /** The picker's `label` prop — its option `testID`s are derived from it. */
  label: string;
  option: string;
};

/**
 * Opens `pickerId`, taps `option`, closes the picker again, then asserts the
 * value it settled on — a swallowed tap fails here rather than as a puzzling
 * assertion further down the test.
 *
 * Closing matters: option rows stay in the hierarchy while a picker is open,
 * and their ids are derived from the label alone, so two pickers sharing a
 * label would expose the same option id twice. Keeping at most one picker open
 * is what makes those ids unambiguous.
 *
 * Returns early when the picker already shows `option`. The check reads the same
 * line the closing assertion checks, and `getAttributes` has no visibility
 * constraint, so an already-set picker costs one read and no gesture at all. It
 * assumes the picker is collapsed — true unless an earlier call threw partway,
 * which fails its own test first.
 */
export async function selectPickerOption(
  { pickerId, label, option }: PickerSelection,
  scroll?: SettingsControlOptions,
) {
  const expected = `${label}: ${option}`;

  if ((await getTopmostMatch(by.id(pickerId))).text === expected) {
    return;
  }

  const scrollToAndTap = async (id: string) => {
    if (scroll !== undefined) {
      const { scrollViewId, ...options } = scroll;
      await rewindAndScrollUntilVisible(id, scrollViewId, options);
    }
    await element(by.id(id)).tap();
  };

  await scrollToAndTap(pickerId);
  await scrollToAndTap(pickerOptionId(label, option));
  await scrollToAndTap(pickerId);

  await expect(element(by.id(pickerId))).toHaveText(expected);
}

/** `to` is the state expected afterwards — a swallowed tap fails here. */
export async function toggleSettingsSwitch(
  { switchId, label, to }: { switchId: string; label: string; to: boolean },
  { scrollViewId, ...scroll }: SettingsControlOptions,
) {
  await rewindAndScrollUntilVisible(switchId, scrollViewId, scroll);
  await element(by.id(switchId)).tap();

  await expect(element(by.text(`${label}: ${to}`))).toBeVisible();
}

// ---------------------------------------------------------------------------
// Stacked screens
//
// Unlike iOS, react-native-screens keeps covered screens attached on Android,
// so a matcher can resolve to one element per stacked screen. These helpers
// normalize such a match to the topmost (last) one.
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
 * Taps `matcher`'s last match — the topmost stacked screen's copy. Pass a
 * freshly built matcher: on Android `atIndex` rewrites it in place, so a reused
 * one stays pinned to the index tapped here.
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
 * Only "nothing matched yet" / "not visible yet" are worth retrying. Anything
 * else — a crashed app, a lost session, a bad matcher — must surface as itself,
 * not as a settle timeout.
 *
 * The two platforms word an empty match differently — Espresso "No views in
 * hierarchy found matching", iOS "No elements found for" — so both are listed;
 * dropping either turns a screen that has not rendered yet into a hard failure
 * on that platform alone.
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
 * Asserts `matcher`'s last match — the topmost stacked screen's copy — is
 * visible. Indexed because a bare `toBeVisible()` throws "matches N views" once
 * several screens are attached; polled because native header chrome can lag the
 * screen's content and `getMatches` throws on the transient 0-match state.
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

/**
 * Waits until the topmost screen shows `Name: <routeName>` — the label the stack
 * test screens render for their route.
 *
 * Indexed to the last match rather than waited on directly: on Android covered
 * screens stay attached, so pushing the same route twice puts two of these
 * labels in the hierarchy and a bare `toBeVisible()` throws "matches N views".
 */
export async function waitForRoute(
  routeName: string,
  timeout = 3000,
): Promise<void> {
  await expectTopmostVisible(by.text(`Name: ${routeName}`), timeout);
}

// ---------------------------------------------------------------------------
// Test screen navigation
// ---------------------------------------------------------------------------

/**
 * The example app sections whose test screens are reached by drilling down
 * (root screen -> scenario group -> screen). Issue tests are excluded because
 * that list is searched rather than drilled — see `selectIssueTestScreen`.
 */
type DrilldownSection = 'component-integration-tests' | 'single-feature-tests';

async function selectDrilldownTestScreen(
  section: DrilldownSection,
  scenarioGroup: string,
  screenKey: string,
) {
  const scenarioGroupId = scenarioGroup.replace(/\s/g, '');

  await scrollUntilVisible(
    `root-screen-${section}`,
    'root-screen-examples-scrollview',
  );
  await element(by.id(`root-screen-${section}`)).tap();
  await waitFor(element(by.id(`${section}-scrollview`)))
    .toBeVisible()
    .withTimeout(3000);

  await scrollUntilVisible(
    `${section}-${scenarioGroupId}`,
    `${section}-scrollview`,
  );
  await element(by.id(`${section}-${scenarioGroupId}`)).tap();
  await waitFor(element(by.id(`${scenarioGroupId}-scenarios-scrollview`)))
    .toBeVisible()
    .withTimeout(3000);

  await scrollUntilVisible(
    screenKey,
    `${scenarioGroupId}-scenarios-scrollview`,
  );
  await element(by.id(screenKey)).tap();
}

export async function selectComponentIntegrationTestsScreen(
  scenarioGroup: string,
  screenKey: string,
) {
  await selectDrilldownTestScreen(
    'component-integration-tests',
    scenarioGroup,
    screenKey,
  );
}

export async function selectSingleFeatureTestsScreen(
  scenarioGroup: string,
  screenKey: string,
) {
  await selectDrilldownTestScreen(
    'single-feature-tests',
    scenarioGroup,
    screenKey,
  );
}

export async function selectIssueTestScreen(screenName: string) {
  await scrollUntilVisible(
    'root-screen-issue-tests',
    'root-screen-examples-scrollview',
  );
  await element(by.id('root-screen-issue-tests')).tap();

  await waitFor(element(by.id('issue-tests-scrollview'))).toBeVisible();

  if (device.getPlatform() === 'android') {
    await element(by.label('Search')).tap();

    // Only way found to reach the search input: matching by type
    // (androidx.appcompat.widget.SearchView.SearchAutoComplete) fails even
    // though it shows up in Detox's view hierarchy.
    await element(by.text('')).replaceText(screenName);
  } else if (device.getPlatform() === 'ios') {
    await element(by.traits(['searchField'])).typeText(screenName);
  }

  await expect(element(by.id(`issue-tests-${screenName}`))).toBeVisible();
  await element(by.id(`issue-tests-${screenName}`)).tap();
}
