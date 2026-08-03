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
 * Detox targets a single simulator per run, selected via the
 * `RNS_APPLE_SIM_NAME` env var (see scripts/e2e/ios-devices.js), which
 * defaults to an iPhone. There is no runtime UIUserInterfaceIdiom query
 * exposed to Detox, so we infer the idiom from the requested simulator name.
 * This lets iPad-only suites self-skip on the default iPhone CI run; they
 * execute only when invoked with e.g. RNS_APPLE_SIM_NAME="iPad Pro 13-inch (M4)".
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

/**
 * Returns every element matching `matcher`, normalizing `getAttributes()`'s
 * single-element object and multi-element `{ elements: [...] }` wrapper to one
 * array. Ordered by view hierarchy, so the topmost stacked screen is last.
 */
export async function getMatches(
  matcher: NativeMatcher,
): Promise<ElementAttributes[]> {
  const attrs = await element(matcher).getAttributes();
  return 'elements' in attrs ? attrs.elements : [attrs];
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

// ---------------------------------------------------------------------------
// Interactions
// ---------------------------------------------------------------------------

export async function scrollUntilVisible(id: string, scrollViewId: string) {
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(600, 'down', Number.NaN, 0.85);
}

/**
 * Performs a coordinate-based tap on iOS to interact with an element that may be
 * obstructed by other UI layers, bypassing Detox's default visibility checks.
 */
export async function forceTapByLabeliOS(testLabel: string) {
  const { x, y, width, height } = (await getSingleMatch(by.label(testLabel)))
    .frame;
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

/** Waits for the toast labelled `message`, then taps it to dismiss it. */
export async function dismissToast(message: string) {
  await waitFor(element(by.label(message)))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.label(message)).tap();
}

// ---------------------------------------------------------------------------
// Stacked screens
//
// Unlike iOS, react-native-screens keeps covered screens attached on Android,
// so a matcher can resolve to one element per stacked screen. These helpers
// normalize such a match to the topmost (last) one.
// ---------------------------------------------------------------------------

/** Reads the trimmed text of `testID` on the topmost stacked screen. */
export async function readTopmostText(testID: string): Promise<string> {
  const matches = await getMatches(by.id(testID));
  const topmost = matches[matches.length - 1];
  return (topmost.text ?? topmost.label ?? '').trim();
}

/** Taps `matcher`'s last match — the topmost stacked screen's copy. */
export async function tapTopmost(matcher: NativeMatcher): Promise<void> {
  const count = (await getMatches(matcher)).length;
  await element(matcher)
    .atIndex(count - 1)
    .tap();
}

/** Taps the button labelled `title` on the topmost stacked screen. */
export async function tapTopmostButton(title: string): Promise<void> {
  await tapTopmost(by.text(title));
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

    // This is the only way I was able to get the search box text input.
    // I don't know why element(by.type('androidx.appcompat.widget.SearchView.SearchAutoComplete'))
    // does not work even if it appears in view hierarchy returned by Detox in debug logging mode.
    await element(by.text('')).replaceText(screenName);
  } else if (device.getPlatform() === 'ios') {
    await element(by.traits(['searchField'])).typeText(screenName);
  }

  await expect(element(by.id(`issue-tests-${screenName}`))).toBeVisible();
  await element(by.id(`issue-tests-${screenName}`)).tap();
}
