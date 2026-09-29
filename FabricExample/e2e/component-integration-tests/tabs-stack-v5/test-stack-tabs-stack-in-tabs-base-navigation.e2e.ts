import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import type { NativeMatcher } from 'detox/detox';
import { expectStillOnRoute, waitForTopmostRoute } from '@e2e/app/stack-route';
import { selectComponentIntegrationTestsScreen } from '@e2e/app/test-screen-navigation';
import { tapTopmostButton, tapWithinFrame } from '@e2e/framework/gestures';
import { getMatches } from '@e2e/framework/matchers';
import { CLASS_NAME_ANDROID_NAVIGATION_BAR_ITEM_VIEW } from '@e2e/framework/native-classes-android';
import {
  CLASS_NAME_UI_TAB_BAR,
  CLASS_NAME_UI_TAB_BAR_BUTTON_IOS26,
  CLASS_NAME_UI_TAB_BAR_BUTTON_LEGACY,
} from '@e2e/framework/native-classes-ios';
import {
  describeIfAndroid,
  describeIfIOS,
  isIOSVersionAtLeast,
} from '@e2e/framework/platform';
import { DEFAULT_TIMEOUT_MS } from '@e2e/framework/wait';

/**
 * Stack in Tabs: basic navigation.
 *
 * The scenario carries no test IDs, so the tab bar is driven through the tab
 * titles and the nested stack is verified through the `Key: r-<route>-<id>`
 * label its screens render (see `@e2e/app/stack-route`).
 *
 * Tab content is matched by the `Key: <routeKey>` label each plain tab
 * renders. Both platforms keep only the selected tab's content in the view
 * hierarchy (iOS removes the other tabs' views from the window, Android
 * detaches their fragments), so a content matcher resolves to the selected tab
 * alone.
 *
 * The two platforms address the tab bar differently, so each keeps its own
 * suite below:
 *
 * - iOS: a tab is a `_UITabButton` (`UITabBarButton` before iOS 26) whose
 *   accessibility label is its title. On iOS 26 the selected button fails
 *   Detox's visibility threshold, so tabs are selected by a coordinate tap on
 *   the button's frame. Covered stack screens are detached, so every matcher
 *   resolves unambiguously to the top screen.
 * - Android: a tab title is rendered by two `TextView`s (the small and the
 *   large label, one of them invisible), so the visible one is tapped by
 *   coordinate. Covered stack screens stay attached, so reads go through the
 *   topmost-match helpers, and React Native's core `<Button>` uppercases its
 *   `title`, so buttons are matched by their rendered text.
 */

const SCENARIO_GROUP = 'Stack V5 & Native Tabs Integration Tests';
const SCENARIO_KEY = 'test-stack-tabs-stack-in-tabs-base-navigation';

const TAB_TITLES = ['First', 'Second', 'Stack'] as const;

type TabTitle = (typeof TAB_TITLES)[number];

/**
 * A tab switch can outlast the default wait: on iOS the tap is a coordinate
 * tap outside Detox's sync, and the first switch into a tab loads its content.
 */
const TAB_SWITCH_TIMEOUT_MS = 2 * DEFAULT_TIMEOUT_MS;

/** Waits for a plain (non-stack) tab's content; its route key is its name. */
async function waitForTabContent(tab: 'First' | 'Second') {
  await waitFor(element(by.text(`Key: ${tab}`)))
    .toBeVisible()
    .withTimeout(TAB_SWITCH_TIMEOUT_MS);
}

/**
 * iOS: coordinate-taps the visible match of `matcher`, or its first match when
 * none reports as visible. A tab bar button can resolve to several elements
 * (UIKit keeps more than one tab bar in the hierarchy), and Detox's own
 * `tap()` rejects the selected button on iOS 26 for failing its visibility
 * threshold.
 */
async function tapTabBarButtonIOS(matcher: NativeMatcher, description: string) {
  const matches = await getMatches(matcher);
  const target =
    matches.find(attributes => 'visible' in attributes && attributes.visible) ??
    matches[0];
  if (target === undefined) {
    throw new Error(`${description}: no element matched.`);
  }
  await tapWithinFrame(target.frame);
}

describeIfIOS('Stack in Tabs: basic navigation', () => {
  const tabBarButtonType = isIOSVersionAtLeast('26.0')
    ? CLASS_NAME_UI_TAB_BAR_BUTTON_IOS26
    : CLASS_NAME_UI_TAB_BAR_BUTTON_LEGACY;

  /** The tab bar button titled `tab`; its accessibility label is the title. */
  const tabBarButton = (tab: TabTitle) =>
    by.label(tab).and(by.type(tabBarButtonType));

  const selectTab = (tab: TabTitle) =>
    tapTabBarButtonIOS(tabBarButton(tab), `tab "${tab}"`);

  beforeAll(async () => {
    await device.reloadReactNative();
    await selectComponentIntegrationTestsScreen(SCENARIO_GROUP, SCENARIO_KEY);
  });

  // Keys captured as the suite progresses, so a later tab round trip can
  // prove the very same screen instances are still in the nested stack.
  let firstKey = '';
  let secondKey = '';
  let thirdKey = '';

  it('should show a tab bar with First, Second and Stack, First selected', async () => {
    await waitForTabContent('First');
    await expect(element(by.type(CLASS_NAME_UI_TAB_BAR))).toBeVisible();
    for (const tab of TAB_TITLES) {
      await expect(element(tabBarButton(tab))).toExist();
    }
  });

  it('should select the Second tab', async () => {
    await selectTab('Second');
    await waitForTabContent('Second');
  });

  it('should show the nested stack on First route in the Stack tab', async () => {
    await selectTab('Stack');
    firstKey = await waitForTopmostRoute('First');
  });

  it('should toggle between First and Stack tabs without a crash', async () => {
    for (let i = 0; i < 3; i++) {
      await selectTab('First');
      await waitForTabContent('First');

      await selectTab('Stack');
      await expectStillOnRoute('First', firstKey);
    }
  });

  it('should push Second with a new key', async () => {
    await element(by.text('Push Second')).tap();
    secondKey = await waitForTopmostRoute('Second');
    jestExpect(secondKey).not.toBe(firstKey);
  });

  it('should push Third on top of Second with a new key', async () => {
    await element(by.text('Push Third')).tap();
    thirdKey = await waitForTopmostRoute('Third');
    jestExpect(thirdKey).not.toBe(secondKey);
    jestExpect(thirdKey).not.toBe(firstKey);
  });

  it('should keep Third on top of the nested stack across a tab round trip', async () => {
    for (let i = 0; i < 2; i++) {
      await selectTab('First');
      await waitForTabContent('First');

      await selectTab('Stack');
      await expectStillOnRoute('Third', thirdKey);
    }
  });
});

describeIfAndroid('Stack in Tabs: basic navigation', () => {
  // React Native's core `<Button>` uppercases its `title` on Android
  // (`title.toUpperCase()`), so buttons are matched by their rendered text.
  const PUSH_SECOND = 'PUSH SECOND';
  const PUSH_THIRD = 'PUSH THIRD';

  /**
   * The bottom navigation item titled `tab`. Matched as the item view that
   * contains the title, since the title itself is rendered by two labels.
   */
  const tabBarItem = (tab: TabTitle) =>
    by
      .type(CLASS_NAME_ANDROID_NAVIGATION_BAR_ITEM_VIEW)
      .withDescendant(by.text(tab));

  const selectTab = (tab: TabTitle) => element(tabBarItem(tab)).tap();

  beforeAll(async () => {
    await device.reloadReactNative();
    await selectComponentIntegrationTestsScreen(SCENARIO_GROUP, SCENARIO_KEY);
  });

  // Keys captured as the suite progresses, so a later tab round trip can
  // prove the very same screen instances are still in the nested stack.
  let firstKey = '';
  let secondKey = '';
  let thirdKey = '';

  // eslint-disable-next-line jest/no-identical-title -- Android and iOS have separate test suites
  it('should show a tab bar with First, Second and Stack, First selected', async () => {
    await waitForTabContent('First');
    for (const tab of TAB_TITLES) {
      await expect(element(tabBarItem(tab))).toBeVisible();
    }
  });

  it('should select the Second tab', async () => {
    await selectTab('Second');
    await waitForTabContent('Second');
  });

  it('should show the nested stack on First route in the Stack tab', async () => {
    await selectTab('Stack');
    firstKey = await waitForTopmostRoute('First');
  });

  it('should toggle between First and Stack tabs without a crash', async () => {
    for (let i = 0; i < 3; i++) {
      await selectTab('First');
      await waitForTabContent('First');

      await selectTab('Stack');
      await expectStillOnRoute('First', firstKey);
    }
  });

  it('should push Second with a new key', async () => {
    await tapTopmostButton(PUSH_SECOND);
    secondKey = await waitForTopmostRoute('Second');
    jestExpect(secondKey).not.toBe(firstKey);
  });

  it('should push Third on top of Second with a new key', async () => {
    await tapTopmostButton(PUSH_THIRD);
    thirdKey = await waitForTopmostRoute('Third');
    jestExpect(thirdKey).not.toBe(secondKey);
    jestExpect(thirdKey).not.toBe(firstKey);
  });

  it('should keep Third on top of the nested stack across a tab round trip', async () => {
    for (let i = 0; i < 2; i++) {
      await selectTab('First');
      await waitForTabContent('First');

      await selectTab('Stack');
      await expectStillOnRoute('Third', thirdKey);
    }
  });
});
