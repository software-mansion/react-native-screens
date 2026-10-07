import { expect as jestExpect } from '@jest/globals';
import { device, element, by, waitFor } from 'detox';
import { expectStillOnRoute, waitForTopmostRoute } from '@e2e/app/stack-route';
import { selectComponentIntegrationTestsScreen } from '@e2e/app/test-screen-navigation';
import { tapTopmostButton } from '@e2e/framework/gestures';
import {
  expectTabBarItemByLabel,
  forceSelectTabByLabel,
} from '@e2e/framework/tab-bar';
import { DEFAULT_TIMEOUT_MS } from '@e2e/framework/wait';

/**
 * Stack in Tabs: basic navigation.
 *
 * Tabs are driven by their `tabBarItemAccessibilityLabel`
 * (`<tab>-tab-item-label`, set in the scenario), plain tab content by its
 * `Key: <routeKey>` label, and the nested stack by its `Key: r-<route>-<id>`
 * label (see `@e2e/app/stack-route`). Only the selected tab's content is in
 * the hierarchy on both platforms, so content matchers resolve to the selected
 * tab alone.
 *
 * One suite for both platforms: on Android covered stack screens stay
 * attached, so reads and taps go through the topmost-match helpers, which on
 * iOS (covered screens detached) resolve to the only match.
 */

const SCENARIO_GROUP = 'Stack V5 & Native Tabs Integration Tests';
const SCENARIO_KEY = 'test-stack-tabs-stack-in-tabs-base-navigation';

const TAB_TITLES = ['First', 'Second', 'Stack'] as const;

type TabTitle = (typeof TAB_TITLES)[number];

/** The tab bar item's `tabBarItemAccessibilityLabel`, as set in the scenario. */
const tabBarItemLabel = (tab: TabTitle) =>
  `${tab.toLowerCase()}-tab-item-label`;

const selectTab = (tab: TabTitle) =>
  forceSelectTabByLabel(tabBarItemLabel(tab));

/**
 * The text React Native's core `<Button>` renders for `title`: uppercased on
 * Android (`title.toUpperCase()`), as given on iOS.
 */
const renderedButtonText = (title: string) =>
  device.getPlatform() === 'android' ? title.toUpperCase() : title;

/** Waits for a plain (non-stack) tab's content; its route key is its name. */
async function waitForTabContent(tab: 'First' | 'Second') {
  await waitFor(element(by.text(`Key: ${tab}`)))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);
}

describe('Stack in Tabs: basic navigation', () => {
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
    for (const tab of TAB_TITLES) {
      await expectTabBarItemByLabel(tabBarItemLabel(tab));
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
    await tapTopmostButton(renderedButtonText('Push Second'));
    secondKey = await waitForTopmostRoute('Second');
    jestExpect(secondKey).not.toBe(firstKey);
  });

  it('should push Third on top of Second with a new key', async () => {
    await tapTopmostButton(renderedButtonText('Push Third'));
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
