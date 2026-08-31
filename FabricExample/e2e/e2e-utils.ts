import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import {
  AndroidElementAttributes,
  IosElementAttributes,
  NativeMatcher,
} from 'detox/detox';
import isVersionEqualOrHigherThan from './helpers/isVersionEqualOrHigherThan';
import {
  CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_APP_BAR_LAYOUT,
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON,
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW,
  CLASS_NAME_ANDROID_CHECK_BOX,
  CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW,
  CLASS_NAME_ANDROID_MATERIAL_TOOLBAR,
  CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW,
  CLASS_NAME_ANDROID_RADIO_BUTTON,
  CLASS_NAME_RNS_TABS_BOTTOM_ACCESSORY,
  CLASS_NAME_UI_BUTTON_BAR_BUTTON,
  CLASS_NAME_UI_CONTEXT_MENU_CELL,
  CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_PLATTER_TRANSITION_VIEW,
  CLASS_NAME_UI_CONTEXT_MENU_SUBMENU_TITLE_VIEW,
  CLASS_NAME_UI_IMAGE_VIEW,
  CLASS_NAME_UI_LABEL,
  CLASS_NAME_UI_MODERN_BAR_BUTTON,
  CLASS_NAME_UI_TAB_BAR,
} from './native-class-names';

const { getIOSVersionNumber } = require('../../scripts/e2e/ios-devices.js');

/** Default for waits Detox's idle sync already mostly covers. */
export const DEFAULT_TIMEOUT_MS = 3000;

export const describeIfiOS =
  device.getPlatform() === 'ios' ? describe : describe.skip;

export const describeIfAndroid =
  device.getPlatform() === 'android' ? describe : describe.skip;

/**
 * Inferred from `RNS_APPLE_SIM_NAME` (Detox has no idiom query), e.g.
 * RNS_APPLE_SIM_NAME="iPad Pro 13-inch (M4)". See scripts/e2e/ios-devices.js.
 */
export const isIPadTarget =
  device.getPlatform() === 'ios' &&
  /^iPad\s/i.test(process.env.RNS_APPLE_SIM_NAME ?? '');

export const describeIfiPad = isIPadTarget ? describe : describe.skip;

/** `true` on iOS at `version` or newer; `false` on Android. */
export function isIOSVersionAtLeast(version: string): boolean {
  return (
    device.getPlatform() === 'ios' &&
    isVersionEqualOrHigherThan(getIOSVersionNumber(), version)
  );
}

/** Suites for iOS 26+ only features; skipped on Android and older iOS. */
export const describeIfiOS26 = isIOSVersionAtLeast('26.0')
  ? describe
  : describe.skip;

export const describeIfiPadOS26 =
  isIPadTarget && isIOSVersionAtLeast('26.0') ? describe : describe.skip;

export type ScrollOptions = {
  /** Pixels per step. Smaller steps avoid overshooting a short row. */
  pixels?: number;
  /** Swipe start, as a fraction of height. Keep it inside the view: on
   * Android a `NaN`/0 start lands in the status bar and opens the shade. */
  startPercentage?: number;
  /** Scroll direction; `whileElement` only ever scrolls one way. */
  direction?: 'up' | 'down';
};

export async function scrollUntilVisible(
  id: string,
  scrollViewId: string,
  {
    pixels = 600,
    startPercentage = 0.85,
    direction = 'down',
  }: ScrollOptions = {},
) {
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(pixels, direction, Number.NaN, startPercentage);
}

/**
 * Rewinds to the top first — `whileElement` only scrolls one way. Down only:
 * rewinding to the top makes an upward scan pointless, so `direction` is
 * rejected at the type level.
 */
export async function rewindAndScrollUntilVisible(
  id: string,
  scrollViewId: string,
  options: Omit<ScrollOptions, 'direction'> = {},
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

/** Root → `section` list → `scenarioGroup` list → `screenKey`. */
async function selectTestsScreen(
  section: 'single-feature-tests' | 'component-integration-tests',
  scenarioGroup: string,
  screenKey: string,
) {
  const scenarioGroupId = scenarioGroup.replace(/\s/g, '');
  const sectionScrollView = `${section}-scrollview`;
  const groupScrollView = `${scenarioGroupId}-scenarios-scrollview`;

  await scrollToAndTapInList(
    `root-screen-${section}`,
    'root-screen-examples-scrollview',
  );
  await waitFor(element(by.id(sectionScrollView)))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);

  await scrollToAndTapInList(
    `${section}-${scenarioGroupId}`,
    sectionScrollView,
  );
  await waitFor(element(by.id(groupScrollView)))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);

  await scrollToAndTapInList(screenKey, groupScrollView);
}

async function scrollToAndTapInList(id: string, scrollViewId: string) {
  await scrollUntilVisible(id, scrollViewId);
  await element(by.id(id)).tap();
}

export const selectSingleFeatureTestsScreen = (
  scenarioGroup: string,
  screenKey: string,
) => selectTestsScreen('single-feature-tests', scenarioGroup, screenKey);

export const selectComponentIntegrationTestsScreen = (
  scenarioGroup: string,
  screenKey: string,
) => selectTestsScreen('component-integration-tests', scenarioGroup, screenKey);

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
 * Sets a picker to `option` and closes it (open option rows collide with the
 * `by.text` popup matchers). No-op when it already shows `option`. Omit
 * `control` for pickers outside a scroll view — they are tapped in place.
 */
export async function selectPickerOption(
  { pickerId, label, option }: PickerSelection,
  control?: SettingsControlOptions,
) {
  const expected = `${label}: ${option}`;

  // Already set. Asserted collapsed: one left open by an earlier failure would
  // collide with later `by.text` matchers.
  if (textOf(await getTopmostMatch(by.id(pickerId))) === expected) {
    await expect(element(by.id(pickerOptionId(label, option)))).not.toExist();
    return;
  }

  const tap = async (id: string) => {
    if (control) {
      await scrollToAndTap(id, control);
    } else {
      await element(by.id(id)).tap();
    }
  };

  await tap(pickerId);
  await tap(pickerOptionId(label, option));
  await tap(pickerId);

  await expectPickerValue(pickerId, expected);
}

/** The value is an RN `Text`: `text` on Android, `label` on iOS. */
async function expectPickerValue(pickerId: string, expected: string) {
  if (device.getPlatform() === 'ios') {
    await expect(element(by.id(pickerId))).toHaveLabel(expected);
  } else {
    await expect(element(by.id(pickerId))).toHaveText(expected);
  }
}

/** `to` is the state expected afterwards — a swallowed tap fails here. Omit
 * `control` on screens whose switches sit outside any scroll view. */
type SwitchToggle = {
  switchId: string;
  /** The switch's `label` prop. */
  label: string;
  /** The state expected after the tap. */
  to: boolean;
};

export async function toggleSettingsSwitch(
  { switchId, label, to }: SwitchToggle,
  control?: SettingsControlOptions,
) {
  if (control) {
    const { scrollViewId, ...scroll } = control;
    await rewindAndScrollUntilVisible(switchId, scrollViewId, scroll);
  }
  await element(by.id(switchId)).tap();

  await expect(element(by.text(`${label}: ${to}`))).toBeVisible();
}

/** Asserts the toolbar-menu screens' `Last clicked: <id>` line. */
export async function expectLastClicked(
  id: string,
  { scrollViewId, ...scroll }: SettingsControlOptions,
) {
  await rewindAndScrollUntilVisible('last-clicked-text', scrollViewId, scroll);
  await expect(element(by.id('last-clicked-text'))).toHaveText(
    `Last clicked: ${id}`,
  );
}

type ElementAttributes = IosElementAttributes | AndroidElementAttributes;

type Frame = ElementAttributes['frame'];

/** Coordinate tap at (`xFraction`, 1/2) of `frame`, bypassing visibility checks. */
async function tapWithinFrame({ x, y, width, height }: Frame, xFraction = 0.5) {
  await device.tap({ x: x + width * xFraction, y: y + height / 2 });
}

/** Coordinate tap (iOS) — bypasses Detox's visibility check. */
export async function forceTapByLabeliOS(testLabel: string) {
  await tapWithinFrame(
    await getFrame(by.label(testLabel), `label "${testLabel}"`),
  );
}

export async function forceSelectTabByLabel(label: string) {
  if (device.getPlatform() === 'ios') {
    await forceTapByLabeliOS(label);
  } else {
    await element(by.label(label)).tap();
  }
}

// ---------------------------------------------------------------------------
// iOS 26 tab bar bottom accessory
// ---------------------------------------------------------------------------

/**
 * The first match — UIKit can keep more than one host view / tab bar in the
 * hierarchy (an accessory mid-transition, a sidebar and tab bar pair on iPad).
 */
async function getFirstMatch(matcher: NativeMatcher) {
  return (await getMatches(matcher))[0] as IosElementAttributes;
}

/** The accessory host view. */
export const getBottomAccessoryAttributes = () =>
  getFirstMatch(by.type(CLASS_NAME_RNS_TABS_BOTTOM_ACCESSORY));

/** The `UITabBar`. */
export const getTabBarAttributes = () =>
  getFirstMatch(by.type(CLASS_NAME_UI_TAB_BAR));

/** Asserts the accessory sits above the tab bar (iPhone "extended" layout). */
export async function expectBottomAccessoryAboveTabBar() {
  const bottomAccessory = await getBottomAccessoryAttributes();
  const tabBar = await getTabBarAttributes();
  jestExpect(tabBar.frame.y).toBeGreaterThan(
    bottomAccessory.frame.y + bottomAccessory.frame.height,
  );
}

export async function dismissToast(message: string) {
  await waitFor(element(by.label(message)))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);
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
 * All matches as one array (topmost stacked screen last). Throws on no match
 * unless `orEmpty`, so a crashed app is not read as "found 0".
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
 * Attributes of `matcher`'s only match; throws when it resolves to several.
 * `description` names the target in that error — a matcher does not stringify.
 */
export async function getSingleMatch(
  matcher: NativeMatcher,
  description = 'matcher',
): Promise<ElementAttributes> {
  const matches = await getMatches(matcher);
  if (matches.length > 1) {
    throw new Error(
      `${description} resolved to ${matches.length} elements, expected exactly one. ` +
        'Narrow the matcher, or the view hierarchy changed.',
    );
  }
  return matches[0];
}

export async function getFrame(matcher: NativeMatcher, description?: string) {
  return (await getSingleMatch(matcher, description)).frame;
}

/** Attributes of `matcher`'s last match — the topmost stacked screen's copy. */
export async function getTopmostMatch(
  matcher: NativeMatcher,
): Promise<ElementAttributes> {
  const matches = await getMatches(matcher);
  return matches[matches.length - 1];
}

/**
 * The value of an RN `Text`, which Detox reports as `text` on Android and as
 * `label` on iOS (`''` when unset).
 */
export function textOf(attributes: ElementAttributes): string {
  return (attributes.text ?? attributes.label ?? '').trim();
}

/** Text of the topmost screen's copy of `testID`. */
export async function readTopmostText(testID: string): Promise<string> {
  return textOf(await getTopmostMatch(by.id(testID)));
}

/** Scrolls `id` into view and returns its text (`''` when unset). */
export async function readText(
  id: string,
  { scrollViewId, ...scroll }: SettingsControlOptions,
): Promise<string> {
  await rewindAndScrollUntilVisible(id, scrollViewId, scroll);
  return textOf(await getSingleMatch(by.id(id), `id "${id}"`));
}

/** Taps the last match (topmost stacked screen). Pass a fresh matcher: `atIndex` mutates it on Android. */
export async function tapTopmost(matcher: NativeMatcher): Promise<void> {
  await element(matcher)
    .atIndex((await countMatches(matcher)) - 1)
    .tap();
}

// ---------------------------------------------------------------------------
// Stack v5 test screens: route information (Android, covered screens attached)
// ---------------------------------------------------------------------------

/** @see apps/src/tests/shared/components/stack-v5/StackRouteInformation.tsx */
const ROUTE_KEY_TEST_ID = 'stack-route-key';

/** The `Key: ...` label of the topmost screen. */
const readTopmostRouteKey = () => readTopmostText(ROUTE_KEY_TEST_ID);

/**
 * Matches the route key label of any screen on `routeName`. Keys are minted as
 * `r-<routeName>-<id>` with an increasing id (`generateRouteKeyForRouteName`),
 * so this pins the route, not the instance.
 */
const routeKeyPattern = (routeName: string) =>
  new RegExp(`^Key: r-${escapeRegExp(routeName)}-\\d+$`);

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Waits until the topmost screen is `routeName` and returns its route key,
 * which pins the instance too (same key: preserved; new key: pushed). Polled:
 * `toBeVisible()` passes on a buried screen, so `waitFor` would not gate a pop.
 */
export async function waitForTopmostRoute(routeName: string): Promise<string> {
  const pattern = routeKeyPattern(routeName);
  let lastSeen = '<never read>';

  await waitUntil(
    async () => {
      lastSeen = await readTopmostRouteKey();
      return pattern.test(lastSeen);
    },
    {
      message: () =>
        `the topmost route to be "${routeName}"; topmost key was "${lastSeen}"`,
    },
  );

  return lastSeen;
}

/**
 * Taps a Push/Pop/Toggle button on the topmost stacked screen. React Native's
 * core `<Button>` uppercases its `title` on Android, so pass the rendered text.
 */
export async function tapTopmostButton(title: string): Promise<void> {
  await tapTopmost(by.text(title));
}

/** Asserts the Push/Pop/Toggle buttons present on the topmost screen. */
export async function expectTopmostButtons(titles: string[]): Promise<void> {
  for (const title of titles) {
    await expectTopmostVisible(() => by.text(title));
  }
}

/** Only "no match yet" (Espresso / iOS wording) and "not visible yet" retry. */
function isTransientMatchError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('No views in hierarchy found matching') ||
    message.includes('No elements found') ||
    message.includes('not visible')
  );
}

/**
 * Polls until the last match of `buildMatcher()` (the topmost stacked screen's
 * copy) is visible. Takes a factory: on Android `atIndex` mutates the matcher,
 * so a reused one would stay pinned to the first poll's index.
 */
export async function expectTopmostVisible(
  buildMatcher: () => NativeMatcher,
  options: Omit<WaitUntilOptions, 'message'> = {},
): Promise<void> {
  let lastError: unknown = '<never attempted>';

  await waitUntil(
    async () => {
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
 * Polls `predicate` until `true` or `timeout`. Prefer Detox's `waitFor`; use
 * this only for conditions it cannot express, e.g. match counts.
 */
export async function waitUntil(
  predicate: () => Promise<boolean>,
  { timeout = DEFAULT_TIMEOUT_MS, interval = 100, message }: WaitUntilOptions,
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
// Android Stack v5 header (toolbar) matchers
// ---------------------------------------------------------------------------
//
// Factories: on Android `atIndex` rewrites a matcher in place (see `tapTopmost`).

/**
 * The Stack v5 header's toolbar. Scoped to `MaterialToolbar` so it never
 * matches the example app's own legacy header, a `CustomToolbar` — which
 * extends `Toolbar` but not `MaterialToolbar`.
 */
export const stackV5Toolbar = (): NativeMatcher =>
  by.type(CLASS_NAME_ANDROID_MATERIAL_TOOLBAR);

/**
 * The Stack v5 header's app bar. Every stacked screen keeps its own
 * `AppBarLayout`, so the bare class matches several; only the Stack v5 header
 * wraps a `MaterialToolbar`.
 */
export const stackV5AppBar = (): NativeMatcher =>
  by.type(CLASS_NAME_ANDROID_APP_BAR_LAYOUT).withDescendant(stackV5Toolbar());

/**
 * The header's back chevron. A covered screen keeps its toolbar but loses its
 * chevron, so under a headered top screen this is that screen's alone; under a
 * headerless one the covered screen's chevron is still there and visible.
 */
export const stackV5BackButton = (): NativeMatcher =>
  by
    .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON)
    .withAncestor(stackV5Toolbar());

/** A native header title, which renders as a `MaterialToolbar` child. */
export const stackV5HeaderTitle = (title: string): NativeMatcher =>
  by.text(title).withAncestor(stackV5Toolbar());

/**
 * A `showAsAction` change re-inflates the action menu, and a rotation does it
 * from a configuration change, so the toolbar can lag an assertion.
 */
export const TOOLBAR_UPDATE_TIMEOUT_MS = DEFAULT_TIMEOUT_MS;

/**
 * Asserts `title`'s action button is up and renders `text`. Asserted
 * positively — on Android a negated matcher passes on a missing view.
 */
async function expectActionItemText(title: string, text: string) {
  await waitFor(element(actionMenuItem(title)))
    .toBeVisible()
    .withTimeout(TOOLBAR_UPDATE_TIMEOUT_MS);
  await waitFor(element(actionMenuItem(title)))
    .toHaveText(text)
    .withTimeout(TOOLBAR_UPDATE_TIMEOUT_MS);
}

/**
 * Asserts `title` is promoted to the toolbar as an icon-only button, whose
 * text AppCompat clears. Which icon it is cannot be asserted through Detox.
 */
export const expectIconActionItem = (title: string) =>
  expectActionItemText(title, '');

/**
 * Asserts `title` is promoted to the toolbar as a text button (no icon, or
 * WITH_TEXT). An icon beside the text is a compound drawable — not assertable.
 */
export const expectTextActionItem = (title: string) =>
  expectActionItemText(title, title);

/** Asserts `title` is not promoted: the button is in neither form. */
export async function expectNoActionItem(title: string) {
  await waitFor(element(actionMenuItem(title)))
    .not.toExist()
    .withTimeout(TOOLBAR_UPDATE_TIMEOUT_MS);
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

/** Outlasts a popup's exit animation without paying the full animation timeout. */
const MENU_DISMISS_PROBE_TIMEOUT_MS = 1000;

/** The accessibility label AppCompat gives the overflow button. */
export const OVERFLOW_MENU_LABEL = 'More options';

/** The popup hosting the overflow menu (or, once opened, a submenu). */
export const overflowMenuMatcher = (): NativeMatcher =>
  by.type(CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW);

export const overflowMenu = () => element(overflowMenuMatcher());

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
 * The visible image view in `title`'s row — divider, submenu arrow or icon;
 * they share one class and Detox cannot tell them apart by resource id.
 */
export function menuItemImage(title: string): NativeMatcher {
  return by
    .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_VIEW)
    .withAncestor(menuItemRow(title));
}

/** `title` inside the focused popup (row title or submenu header). */
export function overflowMenuText(title: string): NativeMatcher {
  return by.text(title).withAncestor(overflowMenuMatcher());
}

/**
 * Any row of the focused popup — the only handle on an entry with no title.
 * Built per call: `atIndex` rewrites the matcher it is given on Android.
 */
export function overflowMenuRow(): NativeMatcher {
  return by
    .type(CLASS_NAME_ANDROID_LIST_MENU_ITEM_VIEW)
    .withAncestor(overflowMenuMatcher());
}

/**
 * A toolbar action button, matched by label in both forms; icon-only buttons
 * have empty text, text buttons show `title`.
 */
export function actionMenuItem(title: string): NativeMatcher {
  return by.label(title).and(by.type(CLASS_NAME_ANDROID_ACTION_MENU_ITEM_VIEW));
}

/** Asserts the open popup lists `titles` top to bottom in this order. */
export async function expectOverflowMenuOrder(
  titles: readonly string[],
): Promise<void> {
  const rows: { title: string; top: number }[] = [];

  for (const title of titles) {
    const { frame } = await getSingleMatch(
      overflowMenuText(title),
      `menu row "${title}"`,
    );
    rows.push({ title, top: frame.y });
  }

  rows.sort((a, b) => a.top - b.top);
  jestExpect(rows.map(row => row.title)).toEqual(titles);
}

/** Asserts `title`'s row hosts a check box (multi-toggle group), not a radio. */
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

/** Overflow-menu helpers bound to one spec's scroll view. */
export function createOverflowMenuHelpers({
  scrollViewId,
  maxMenuDepth = 3,
}: OverflowMenuControl) {
  /** Detox searches the focused window only: the screen itself must be back. */
  const waitForScreen = async () => {
    await waitFor(element(by.id(scrollViewId)))
      .toBeVisible()
      .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
  };

  /** Reported rather than thrown — a stacked popup keeps it false. The short
   * probe outlasts the exit animation without stalling stacked cleanup. */
  const isScreenAddressable = () =>
    waitFor(element(by.id(scrollViewId)))
      .toBeVisible()
      .withTimeout(MENU_DISMISS_PROBE_TIMEOUT_MS)
      .then(
        () => true,
        () => false,
      );

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

      // A popup lingers while animating out and would read as a second menu;
      // the screen coming back settles it. If it does not, a parent popup is up.
      if (await isScreenAddressable()) {
        return;
      }
    }

    if (pressCount > 0) {
      await waitForScreen();
    }
  };

  /** Closes the menu even on failure — a leaked popup fails every later case. */
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

  const waitForMenuItem = async (title: string) => {
    await waitFor(element(overflowMenuText(title)))
      .toBeVisible()
      .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
  };

  /** Taps `title` in the open popup and waits for the popup to go away. */
  const tapMenuItem = async (title: string) => {
    await waitForMenuItem(title);
    await element(overflowMenuText(title)).tap();
    await waitFor(element(overflowMenuText(title)))
      .not.toExist()
      .withTimeout(MENU_ANIMATION_TIMEOUT_MS);
    await waitForScreen();
  };

  return {
    waitForScreen,
    closeMenuIfOpen,
    closingMenuAfter,
    withOverflowMenu,
    waitForMenuItem,
    tapMenuItem,
  };
}

// ---------------------------------------------------------------------------
// iOS Stack v5 header items (UIBarButtonItem)
// ---------------------------------------------------------------------------

export type HeaderItemOptions = {
  /**
   * Match the inner control (`_UIModernBarButton`) instead of the item
   * container (`_UIButtonBarButton`). Both carry the title as their label.
   */
  control?: boolean;
};

/** A title-only header item, addressed by its visible title. */
export function headerItem(
  title: string,
  { control = false }: HeaderItemOptions = {},
) {
  return element(
    by
      .type(
        control
          ? CLASS_NAME_UI_MODERN_BAR_BUTTON
          : CLASS_NAME_UI_BUTTON_BAR_BUTTON,
      )
      .and(by.label(title)),
  );
}

/** The header title label. */
export function headerTitle(title: string): NativeMatcher {
  return by.type(CLASS_NAME_UI_LABEL).and(by.text(title));
}

/** A header item's icon, by icon id (SF Symbol name or asset path). */
export function barButtonIcon(iconId: string) {
  return element(
    by.id(iconId).withAncestor(by.type(CLASS_NAME_UI_MODERN_BAR_BUTTON)),
  );
}

// ---------------------------------------------------------------------------
// iOS context menu (UIMenu presented from a header item or the title)
// ---------------------------------------------------------------------------

/**
 * Detox's idle sync does not cover the menu's present/dismiss animation, so
 * waits that straddle it must be explicit.
 */
export const CONTEXT_MENU_ANIMATION_TIMEOUT_MS = 2000;

/**
 * Tap point on the dismiss overlay, as a fraction of its width: the leading
 * edge is clear of a trailing- or title-anchored platter (a platter tap only
 * pops one level).
 */
const CONTEXT_MENU_DISMISS_X_FRACTION = 0.1;

/** The list hosting the rows of the presented menu (or submenu). */
export const contextMenu = () =>
  element(by.type(CLASS_NAME_UI_CONTEXT_MENU_LIST_VIEW));

export type MenuRowOptions = {
  /**
   * Restrict to selectable rows (those inside a `_UIContextMenuCell`). This
   * excludes a submenu's pinned title/back row, which shares the label of the
   * submenu's first entry when that item also has an `onPress`.
   */
  actionsOnly?: boolean;
};

/** Matcher for a row of a presented menu, addressed by its visible label. */
export function menuRowMatcher(
  title: string,
  { actionsOnly = false }: MenuRowOptions = {},
): NativeMatcher {
  const row = by
    .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
    .and(by.label(title));
  return actionsOnly
    ? row.withAncestor(by.type(CLASS_NAME_UI_CONTEXT_MENU_CELL))
    : row;
}

/** A row of a presented menu, addressed by its visible label. */
export function menuRow(title: string, options?: MenuRowOptions) {
  return element(menuRowMatcher(title, options));
}

/** A submenu's pinned title row — its own class, not a menu row. */
export function submenuTitleRow(title: string) {
  return element(
    by
      .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
      .and(by.label(title))
      .withAncestor(by.type(CLASS_NAME_UI_CONTEXT_MENU_SUBMENU_TITLE_VIEW)),
  );
}

/** The checkmark of a checked toggle / singleSelection row. */
export function checkmarkFor(title: string) {
  return element(by.id('checkmark').withAncestor(menuRowMatcher(title)));
}

/** The submenu chevron; absent on inlined submenus. */
export function chevronFor(title: string) {
  return element(by.id('chevron.forward').withAncestor(menuRowMatcher(title)));
}

/** A row's icon by id, scoped to its row: parent rows stay attached under a submenu. */
export function menuRowIcon(iconId: string, title: string) {
  return element(
    by
      .type(CLASS_NAME_UI_IMAGE_VIEW)
      .and(by.id(iconId))
      .withAncestor(menuRowMatcher(title)),
  );
}

export type OpenContextMenuOptions = {
  /** `longPress` for an item that also has an `onPress` — a tap fires that. */
  gesture?: 'tap' | 'longPress';
  timeout?: number;
};

/** Opens the menu attached to `anchor` and waits for it to present. */
export async function openContextMenu(
  anchor: Detox.NativeElement,
  {
    gesture = 'tap',
    timeout = CONTEXT_MENU_ANIMATION_TIMEOUT_MS,
  }: OpenContextMenuOptions = {},
) {
  await waitFor(anchor).toBeVisible().withTimeout(timeout);
  if (gesture === 'longPress') {
    await anchor.longPress();
  } else {
    await anchor.tap();
  }
  await waitFor(contextMenu()).toBeVisible().withTimeout(timeout);
}

/**
 * Opens the menu attached to the header title. UIKit's title control fails
 * Detox's visibility threshold, so the label is tapped by coordinates.
 */
export async function openHeaderTitleMenu(
  title: string,
  timeout = CONTEXT_MENU_ANIMATION_TIMEOUT_MS,
) {
  await tapWithinFrame(await getFrame(headerTitle(title)));
  await waitFor(contextMenu()).toBeVisible().withTimeout(timeout);
}

/**
 * Dismisses the menu at any submenu depth by tapping UIKit's dismiss overlay
 * near its leading edge (a tap on the menu itself only pops one level).
 */
export async function dismissContextMenu(
  timeout = CONTEXT_MENU_ANIMATION_TIMEOUT_MS,
) {
  await tapWithinFrame(
    await getFrame(
      by.type(CLASS_NAME_UI_CONTEXT_MENU_PLATTER_TRANSITION_VIEW),
      'the context menu platter',
    ),
    CONTEXT_MENU_DISMISS_X_FRACTION,
  );
  await waitFor(contextMenu()).not.toExist().withTimeout(timeout);
}
