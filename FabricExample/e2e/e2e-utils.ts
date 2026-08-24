import { device, expect, element, by } from 'detox';
import {
  AndroidElementAttributes,
  IosElementAttributes,
  NativeMatcher,
} from 'detox/detox';
import isVersionEqualOrHigherThan from './helpers/isVersionEqualOrHigherThan';
import {
  CLASS_NAME_ANDROID_CHECK_BOX,
  CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW,
  CLASS_NAME_ANDROID_RADIO_BUTTON,
} from './native-class-names';

const { getIOSVersionNumber } = require('../../scripts/e2e/ios-devices.js');

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

/**
 * Suites for iOS 26+ only features (e.g. `bottomAccessory`, the header overflow
 * button). `isIOSVersionAtLeast` is false on Android, so these stay iOS-only
 * and additionally self-skip on iOS 18 and older.
 */
export const describeIfiOS26 = isIOSVersionAtLeast('26.0')
  ? describe
  : describe.skip;

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

/** Rewinds to the top first — `whileElement` only scrolls one way. */
export async function rewindAndScrollUntilVisible(
  id: string,
  scrollViewId: string,
  options: ScrollOptions = {},
) {
  await element(by.id(scrollViewId)).scrollTo('top');
  await scrollUntilVisible(id, scrollViewId, options);
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

/** @see apps/src/shared/SettingsPicker.tsx — derives option `testID`s. */
export function pickerOptionId(pickerLabel: string, option: string): string {
  return `${pickerLabel.split(' ').join('-')}-${option}`.toLowerCase();
}

export type SettingsControlOptions = ScrollOptions & { scrollViewId: string };

/** Rewinds, scrolls `id` into view and taps it. */
export async function scrollToAndTap(
  id: string,
  { scrollViewId, ...scroll }: SettingsControlOptions,
) {
  await rewindAndScrollUntilVisible(id, scrollViewId, scroll);
  await element(by.id(id)).tap();
}

type PickerSelection = {
  pickerId: string;
  /** The picker's `label` prop — option `testID`s are derived from it. */
  label: string;
  option: string;
};

/**
 * Closes the picker again: its option rows stay in the hierarchy while open and
 * would collide with the `by.text` matchers used for native popups.
 *
 * Returns early when the picker already shows `option`. The check reads the same
 * line the closing assertion checks, and `getAttributes` has no visibility
 * constraint, so an already-set picker costs one read and no gesture at all.
 * It assumes the picker is collapsed — true unless an earlier call threw partway,
 * which fails its own test first.
 */
export async function selectPickerOption(
  { pickerId, label, option }: PickerSelection,
  { scrollViewId, ...scroll }: SettingsControlOptions,
) {
  const expected = `${label}: ${option}`;

  if ((await getTopmostMatch(by.id(pickerId))).text === expected) {
    return;
  }

  const control = { scrollViewId, ...scroll };
  await scrollToAndTap(pickerId, control);
  await scrollToAndTap(pickerOptionId(label, option), control);
  await scrollToAndTap(pickerId, control);

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
 * Attributes of a single element on either platform. Cast to
 * `IosElementAttributes` / `AndroidElementAttributes` at the call site for
 * platform-specific fields.
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
 * Coordinate-based tap on iOS, bypassing Detox's visibility checks so an
 * element obstructed by other UI layers can still be hit.
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

/** Attributes of `matcher`'s last match — the topmost stacked screen's copy. */
export async function getTopmostMatch(
  matcher: NativeMatcher,
): Promise<ElementAttributes> {
  const matches = await getMatches(matcher);
  return matches[matches.length - 1];
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

/**
 * Only "nothing matched yet" / "not visible yet" are worth retrying. Anything
 * else — a crashed app, a lost session, a bad matcher — must surface as itself,
 * not as a settle timeout.
 */
function isTransientMatchError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('No views in hierarchy found matching') ||
    message.includes('not visible')
  );
}

/**
 * Asserts the last match of `buildMatcher()` — the topmost stacked screen's
 * copy — is visible. Indexed because a bare `toBeVisible()` throws once several
 * screens are attached; polled because header chrome can lag the content.
 *
 * Pass a factory, not a matcher: on Android `atIndex` rewrites one in place, so
 * a reused matcher would pin later polls to the first attempt's index, where a
 * now-buried view still reads as visible and would pass falsely.
 *
 * Only for elements expected to be present — absence burns the full timeout.
 */
export async function expectTopmostVisible(
  buildMatcher: () => NativeMatcher,
  options: Omit<WaitUntilOptions, 'message'> = {},
): Promise<void> {
  let lastError: unknown = '<never attempted>';

  await waitUntil(
    async () => {
      // Fresh per attempt: `countMatches` reads it before `atIndex` mutates it,
      // and it is discarded before the next poll.
      const matcher = buildMatcher();
      try {
        const count = await countMatches(matcher);
        await expect(element(matcher).atIndex(count - 1)).toBeVisible();
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
      ...options,
      message: () =>
        `the topmost match to be visible; last failure: ${lastError}`,
    },
  );
}

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
// Android toolbar overflow menu (Stack v5 header)
// ---------------------------------------------------------------------------

/**
 * Detox's idle sync does not cover popup window animations, so waits that
 * straddle the overflow menu opening or dismissing must be explicit.
 */
export const MENU_ANIMATION_TIMEOUT_MS = 5000;

/** Probes an already-settled popup: by now it is either up or was never opened. */
export const MENU_PRESENCE_TIMEOUT_MS = 250;

/** The accessibility label AppCompat gives the overflow button. */
const OVERFLOW_MENU_LABEL = 'More options';

export const overflowMenu = () =>
  element(by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW));

/**
 * A multi-toggle group renders check boxes and a single-selection one radio
 * buttons, so the class asserts the group type.
 */
export type ToggleWidget =
  | typeof CLASS_NAME_ANDROID_CHECK_BOX
  | typeof CLASS_NAME_ANDROID_RADIO_BUTTON;

export function menuItemRow(title: string): NativeMatcher {
  return by
    .type(CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW)
    .withDescendant(by.text(title));
}

export function menuItemToggle(
  title: string,
  widget: ToggleWidget,
): NativeMatcher {
  return by.type(widget).withAncestor(menuItemRow(title));
}

/**
 * Asserts `title`'s row hosts a check box (a multi-toggle group) — the sibling
 * widget is asserted absent so a mismatched group type fails loudly instead of
 * matching nothing.
 */
export async function expectCheckBox(title: string, checked: boolean) {
  await expect(
    element(menuItemToggle(title, CLASS_NAME_ANDROID_RADIO_BUTTON)),
  ).not.toExist();
  await expect(
    element(menuItemToggle(title, CLASS_NAME_ANDROID_CHECK_BOX)),
  ).toHaveToggleValue(checked);
}

/** Asserts `title`'s row hosts a radio button (a single-selection group). */
export async function expectRadioButton(title: string, checked: boolean) {
  await expect(
    element(menuItemToggle(title, CLASS_NAME_ANDROID_CHECK_BOX)),
  ).not.toExist();
  await expect(
    element(menuItemToggle(title, CLASS_NAME_ANDROID_RADIO_BUTTON)),
  ).toHaveToggleValue(checked);
}

/** Resolves instead of throwing, so it can be used as a condition. */
export async function isMenuOpen(): Promise<boolean> {
  return waitFor(overflowMenu())
    .toExist()
    .withTimeout(MENU_PRESENCE_TIMEOUT_MS)
    .then(
      () => true,
      () => false,
    );
}

/** Waits for the popup itself, so a menu that never opened fails here rather
 * than on a row assertion racing the open animation. */
export async function openOverflowMenu() {
  await element(by.label(OVERFLOW_MENU_LABEL)).tap();
  await waitFor(overflowMenu())
    .toBeVisible()
    .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
}

export type OverflowMenuControl = {
  /** The screen's scroll view — the anchor proving the popup is gone. */
  scrollViewId: string;
  /**
   * Upper bound of Back presses while a popup is still up: one per popup of
   * the deepest expected path. The default covers an overflow menu with one
   * submenu level, plus margin to notice an unexpected extra popup.
   */
  maxMenuDepth?: number;
};

/**
 * The helpers that depend on the screen behind the popup, bound to one spec's
 * scroll view.
 */
export function createOverflowMenuHelpers({
  scrollViewId,
  maxMenuDepth = 3,
}: OverflowMenuControl) {
  /**
   * Detox searches one window: while a popup holds focus nothing behind it is
   * in the hierarchy, so the popup going away is not enough — the screen
   * itself has to become addressable again.
   */
  const waitForScreen = async () => {
    await waitFor(element(by.id(scrollViewId)))
      .toBeVisible()
      .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
  };

  /**
   * Back only ever goes to an open popup: with no menu up the activity takes
   * it and pops the test screen, failing every later case in a stateful
   * suite. Submenus stack a popup per level, hence the loop.
   */
  const closeMenuIfOpen = async () => {
    let pressCount = 0;

    while (await isMenuOpen()) {
      if (pressCount === maxMenuDepth) {
        throw new Error(
          `The overflow menu was still open after ${maxMenuDepth} Back presses.`,
        );
      }
      await device.pressBack();
      pressCount++;
    }

    if (pressCount > 0) {
      await waitForScreen();
    }
  };

  /**
   * Closes the menu even on failure: a leaked popup is never a local problem —
   * every later matcher would resolve against the popup window instead of the
   * activity, failing the rest of the suite on views that are plainly there.
   */
  const closingMenuAfter = async (assertions: () => Promise<void>) => {
    let assertionFailed = false;

    try {
      await assertions();
    } catch (error) {
      assertionFailed = true;
      throw error;
    } finally {
      try {
        await closeMenuIfOpen();
      } catch (cleanupError) {
        // A throw from `finally` would replace the error that actually failed.
        if (!assertionFailed) {
          throw cleanupError;
        }
      }
    }
  };

  /**
   * While the menu is open, Espresso resolves matchers against its window, so
   * `assertions` can only address rows inside it.
   */
  const withOverflowMenu = async (assertions: () => Promise<void>) => {
    await openOverflowMenu();
    await closingMenuAfter(assertions);
  };

  return { waitForScreen, closeMenuIfOpen, closingMenuAfter, withOverflowMenu };
}
