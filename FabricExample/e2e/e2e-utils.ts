import { device, expect, element, by } from 'detox';
import {
  AndroidElementAttributes,
  IosElementAttributes,
  NativeMatcher,
} from 'detox/detox';
import isVersionEqualOrHigherThan from './helpers/isVersionEqualOrHigherThan';

const { getIOSVersionNumber } = require('../../scripts/e2e/ios-devices.js');

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

export async function scrollUntilVisible(id: string, scrollViewId: string) {
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(600, 'down', Number.NaN, 0.85);
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

export async function selectComponentIntegrationTestsScreen(
  scenarioGroup: string,
  screenKey: string,
) {
  const scenarioGroupId = scenarioGroup.replace(/\s/g, '');
  await scrollUntilVisible(
    'root-screen-component-integration-tests',
    'root-screen-examples-scrollview',
  );
  await element(by.id('root-screen-component-integration-tests')).tap();

  await waitFor(element(by.id('component-integration-tests-scrollview')))
    .toBeVisible()
    .withTimeout(3000);

  await scrollUntilVisible(
    `component-integration-tests-${scenarioGroupId}`,
    'component-integration-tests-scrollview',
  );

  await element(by.id(`component-integration-tests-${scenarioGroupId}`)).tap();
  await waitFor(element(by.id(`${scenarioGroupId}-scenarios-scrollview`)))
    .toBeVisible()
    .withTimeout(3000);

  await scrollUntilVisible(
    `${screenKey}`,
    `${scenarioGroupId}-scenarios-scrollview`,
  );
  await element(by.id(`${screenKey}`)).tap();
}

export async function selectSingleFeatureTestsScreen(
  scenarioGroup: string,
  screenKey: string,
) {
  const scenarioGroupId = scenarioGroup.replace(/\s/g, '');
  await scrollUntilVisible(
    'root-screen-single-feature-tests',
    'root-screen-examples-scrollview',
  );
  await element(by.id('root-screen-single-feature-tests')).tap();
  await waitFor(element(by.id('single-feature-tests-scrollview')))
    .toBeVisible()
    .withTimeout(3000);

  await scrollUntilVisible(
    `single-feature-tests-${scenarioGroupId}`,
    'single-feature-tests-scrollview',
  );
  await element(by.id(`single-feature-tests-${scenarioGroupId}`)).tap();
  await waitFor(element(by.id(`${scenarioGroupId}-scenarios-scrollview`)))
    .toBeVisible()
    .withTimeout(3000);

  await scrollUntilVisible(
    `${screenKey}`,
    `${scenarioGroupId}-scenarios-scrollview`,
  );
  await element(by.id(`${screenKey}`)).tap();
}

type ElementAttributes = IosElementAttributes | AndroidElementAttributes;

type ElementMatcher = {
  /** Which matcher to resolve the element by. */
  by: 'label' | 'id' | 'type';
  /** The label text, testID, or native type name to match. */
  value: string;
  /** Disambiguate when the matcher resolves to multiple elements. */
  index?: number;
};

function resolveMatcher({ by: matcher, value }: ElementMatcher) {
  switch (matcher) {
    case 'label':
      return by.label(value);
    case 'id':
      return by.id(value);
    case 'type':
      return by.type(value);
    default: {
      const _exhaustive: never = matcher;
      throw new Error(`Unsupported matcher: ${_exhaustive}`);
    }
  }
}

/**
 * Reads the attributes of a single element on either platform. Cast the result
 * to `IosElementAttributes` / `AndroidElementAttributes` at the call site when
 * you need platform-specific fields.
 */
export async function getElementAttributes(
  matcher: ElementMatcher,
): Promise<ElementAttributes> {
  const target = element(resolveMatcher(matcher));
  const attrs = await (matcher.index === undefined
    ? target
    : target.atIndex(matcher.index)
  ).getAttributes();

  if ('elements' in attrs) {
    throw new Error(
      `Multiple elements (${attrs.elements.length}) found for ${matcher.by}: "${matcher.value}". ` +
        `Pass an \`index\` to disambiguate.`,
    );
  }

  return attrs as ElementAttributes;
}
/**
 * Performs a coordinate-based tap on iOS to interact with an element that may be
 * obstructed by other UI layers, bypassing Detox's default visibility checks.
 */
export async function forceTapByLabeliOS(testLabel: string) {
  const elementAttributes = await getElementAttributes({
    by: 'label',
    value: testLabel,
  });
  const { x, y, width, height } = elementAttributes.frame;
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

export async function dismissToast(message: string) {
  await waitFor(element(by.label(message)))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.label(message)).tap();
}

/**
 * Returns every element matching `matcher`, normalizing `getAttributes()`'s
 * single-element object and multi-element `{ elements: [...] }` wrapper to one
 * array. Ordered by view hierarchy, so the topmost stacked screen is last.
 *
 * Throws when nothing matches — left uncaught so a crash is not misreported
 * as "found 0".
 */
export async function getMatches(
  matcher: NativeMatcher,
): Promise<ElementAttributes[]> {
  const attrs = await element(matcher).getAttributes();
  return 'elements' in attrs ? attrs.elements : [attrs];
}

/** How many elements `matcher` resolves to. */
export async function countMatches(matcher: NativeMatcher): Promise<number> {
  return (await getMatches(matcher)).length;
}

/** Attributes of `matcher`'s last match — the topmost stacked screen's copy. */
export async function getTopmostMatch(
  matcher: NativeMatcher,
): Promise<ElementAttributes> {
  const matches = await getMatches(matcher);
  return matches[matches.length - 1];
}

/**
 * Polls until `matcher` resolves and its last match is visible, then returns
 * that match's index.
 *
 * Resolving the topmost match takes two round-trips — count, then index — and
 * Detox retries neither: zero matches throw, `toBeVisible()` fails immediately,
 * and a screen attaching between the calls leaves the index stale. Native header
 * chrome can lag the pushed screen's content, so any of the three is reachable.
 * Their errors are indistinguishable, hence one poll over the whole predicate.
 */
async function waitForSettledTopmostIndex(
  matcher: NativeMatcher,
  timeout: number,
  interval: number,
): Promise<number> {
  const deadline = Date.now() + timeout;
  let lastError: unknown = '<never attempted>';
  while (Date.now() <= deadline) {
    try {
      const index = (await countMatches(matcher)) - 1;
      await expect(element(matcher).atIndex(index)).toBeVisible();
      return index;
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  throw new Error(
    `waitForSettledTopmostIndex timed out after ${timeout}ms waiting for the ` +
      `topmost match to be visible; last failure: ${lastError}`,
  );
}

/**
 * Asserts `matcher`'s last match — the topmost stacked screen's copy — is
 * visible, retrying until it settles. Scoped to the last match because a bare
 * `toBeVisible()` throws "matches N views" once several screens are attached.
 *
 * Only for elements expected to be present — absence burns the full timeout.
 * Use `not.toExist()` instead.
 */
export async function waitForTopmostVisible(
  matcher: NativeMatcher,
  timeout = 3000,
  interval = 100,
): Promise<void> {
  await waitForSettledTopmostIndex(matcher, timeout, interval);
}

/**
 * Taps `matcher`'s last match — the topmost stacked screen's copy. Only the
 * resolution is retried; the tap fires once, since a retried tap could
 * double-fire when the response fails after it landed — which suites counting
 * per-press side effects (toasts, pops) would read as an extra press.
 */
export async function tapTopmost(matcher: NativeMatcher): Promise<void> {
  const index = await waitForSettledTopmostIndex(matcher, 3000, 100);
  await element(matcher).atIndex(index).tap();
}
