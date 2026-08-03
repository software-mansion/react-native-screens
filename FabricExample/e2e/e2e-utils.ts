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
// Interactions
// ---------------------------------------------------------------------------

export async function scrollUntilVisible(
  id: string,
  scrollViewId: string,
  pixelsPerStep = 600,
) {
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(pixelsPerStep, 'down', Number.NaN, 0.85);
}

/**
 * Rewinds to the top first, so a target above the current offset is still
 * reachable — `whileElement` only scrolls one way.
 */
export async function rewindAndScrollUntilVisible(
  id: string,
  scrollViewId: string,
  pixelsPerStep = 600,
) {
  await element(by.id(scrollViewId)).scrollTo('top');
  await scrollUntilVisible(id, scrollViewId, pixelsPerStep);
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

export type PickerSelection = {
  pickerId: string;
  /** The picker's `label` prop — its option `testID`s are derived from it. */
  label: string;
  option: string;
};

/** Set when the picker or its rows can sit outside the viewport. */
export type PickerScrollOptions = {
  scrollViewId: string;
  /** Pixels per scroll step. Smaller steps avoid overshooting a short row. */
  pixelsPerStep?: number;
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
 */
export async function selectPickerOption(
  { pickerId, label, option }: PickerSelection,
  scroll?: PickerScrollOptions,
) {
  const tapById = async (id: string) => {
    if (scroll !== undefined) {
      await rewindAndScrollUntilVisible(
        id,
        scroll.scrollViewId,
        scroll.pixelsPerStep,
      );
    }
    await element(by.id(id)).tap();
  };

  await tapById(pickerId);
  await tapById(pickerOptionId(label, option));
  await tapById(pickerId);

  await expect(element(by.id(pickerId))).toHaveLabel(`${label}: ${option}`);
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

/**
 * Waits until a screen showing `Name: <routeName>` is visible — the label the
 * stack test screens render for their route.
 *
 * Safe only where covered screens leave the hierarchy, i.e. iOS. On Android
 * they stay attached, so this matcher can resolve to one element per stacked
 * screen and `toBeVisible()` throws "matches N views"; poll
 * `readTopmostText('stack-route-name')` there instead.
 */
export async function waitForRoute(
  routeName: string,
  timeout = 3000,
): Promise<void> {
  await waitFor(element(by.text(`Name: ${routeName}`)))
    .toBeVisible()
    .withTimeout(timeout);
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
