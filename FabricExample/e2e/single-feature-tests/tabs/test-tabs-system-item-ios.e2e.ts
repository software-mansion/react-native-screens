import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import {
  IosElementAttributes,
  NativeElement,
  NativeMatcher,
} from 'detox/detox';
import {
  selectSingleFeatureTestsScreen,
  describeIfiOS,
  tapWhenHittableiOS,
} from '../../e2e-utils';
import isVersionEqualOrHigherThan from '../../helpers/isVersionEqualOrHigherThan';
import {
  CLASS_NAME_UI_TAB_BAR,
  CLASS_NAME_UI_TAB_BAR_BUTTON_LABEL,
  CLASS_NAME_UI_TAB_BAR_BUTTON_IOS26,
  CLASS_NAME_UI_TAB_BAR_BUTTON_LEGACY,
} from '../../native-class-names';
import type {
  IconOption,
  OptionGroup,
  SystemItemOption,
  TitleOption,
} from '@apps/tests/single-feature-tests/tabs/test-tabs-system-item-ios';
const {
  getIOSVersionNumber,
} = require('../../../../scripts/e2e/ios-devices.js');

/**
 * Upper bound for anything that has to outlast a native re-layout. Applying a
 * runtime option travels JS state -> `setRouteOptions` -> native tab bar
 * update, and the tab bar lays out again once the SF Symbol icon finishes
 * loading. Detox's `expect(...)` samples the hierarchy once, so every assertion
 * that directly follows a state change has to wait instead.
 */
const SETTLE_TIMEOUT = 5000;
const FRAME_POLL_INTERVAL = 150;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function waitUntilVisible(target: NativeElement) {
  await waitFor(target).toBeVisible().withTimeout(SETTLE_TIMEOUT);
}

async function waitUntilExists(target: NativeElement) {
  await waitFor(target).toExist().withTimeout(SETTLE_TIMEOUT);
}

async function waitUntilGone(target: NativeElement) {
  await waitFor(target).not.toExist().withTimeout(SETTLE_TIMEOUT);
}

function isIOSVersionAtLeast(version: string): boolean {
  return (
    device.getPlatform() === 'ios' &&
    isVersionEqualOrHigherThan(getIOSVersionNumber(), version)
  );
}

const tabBarButtonType = isIOSVersionAtLeast('26.0')
  ? CLASS_NAME_UI_TAB_BAR_BUTTON_IOS26
  : CLASS_NAME_UI_TAB_BAR_BUTTON_LEGACY;

const STATIC_SYSTEM_ITEM_TAB_TEST_ID = 'bookmark-tab-item';

/**
 * Only depend on this while the Runtime Config tab's options are pristine.
 * After a `setRouteOptions` update the identifier is not reliably present on
 * the tab bar item — a `by.id` match for it failed outright mid-suite, while
 * the Bookmarks button, whose options are never touched, kept
 * `id="bookmark-tab-item"` throughout. Once options have changed, address the
 * tab by its current label instead; see {@link runtimeConfigTabLabelled}.
 */
const PRISTINE_RUNTIME_CONFIG_TAB_TEST_ID = 'custom-tab-item';

/**
 * How each tab is selected, plus a unique piece of its screen content that tells
 * `selectTab` where it already is.
 */
const TAB_STATIC_SYSTEM_ITEM: Tab = {
  matcher: by.id(STATIC_SYSTEM_ITEM_TAB_TEST_ID),
  screenText: 'Static System Item',
};
const TAB_RUNTIME_CONFIG: Tab = {
  matcher: by.id(PRISTINE_RUNTIME_CONFIG_TAB_TEST_ID),
  screenText: 'Runtime Config',
};

/**
 * The Runtime Config tab once its options have been changed and the testID is
 * gone. `index` is passed because the label also matches the button's inner
 * label view; the button itself comes first.
 */
const runtimeConfigTabLabelled = (currentLabel: string): Tab => ({
  matcher: by.label(currentLabel).and(by.type(tabBarButtonType)),
  index: 0,
  screenText: 'Runtime Config',
});

type Tab = {
  matcher: NativeMatcher;
  index?: number;
  screenText: string;
};

async function isScreenShowing(text: string): Promise<boolean> {
  try {
    await waitFor(element(by.text(text)))
      .toBeVisible()
      .withTimeout(1000);
    return true;
  } catch {
    return false;
  }
}

/**
 * Switches to `tab`, skipping the tap when that tab is already selected.
 *
 * The skip is required, not an optimisation: on iOS 26 the selected tab bar
 * button permanently reports `visible=false, hittable=false` under the
 * liquid-glass selection indicator, so tapping it always throws — see
 * `tapWhenHittableiOS`.
 */
async function selectTab(tab: Tab) {
  if (await isScreenShowing(tab.screenText)) {
    return;
  }
  await tapWhenHittableiOS(tab.matcher, { index: tab.index });
  await waitUntilVisible(element(by.text(tab.screenText)));
}

/**
 * Option buttons are addressed by testID (`<group>-option-<value>`) rather than
 * by their visible text: `system` exists in both the title and the icon row, so
 * a text match would have to be disambiguated by hierarchy position.
 */
async function tapOption(group: OptionGroup, option: string) {
  await element(by.id(`${group}-option-${option}`)).tap();
}

const setSystemItemOption = (option: SystemItemOption) =>
  tapOption('system-item', option);
const setTitleOption = (option: TitleOption) => tapOption('title', option);
const setIconOption = (option: IconOption) => tapOption('icon', option);

const configSystemItem = (value: string) =>
  element(by.id('config-systemitem').and(by.label(`systemItem: '${value}'`)));
const configTitle = (value: string) =>
  element(by.id('config-title').and(by.label(`title: ${value}`)));
const configIcon = (value: string) =>
  element(by.id('config-icon').and(by.label(`icon: ${value}`)));

const tabBarButtonLabelled = (label: string) =>
  element(by.label(label).and(by.type(tabBarButtonType))).atIndex(0);

async function getTabBarItemFrameX(tabLabel: string): Promise<number> {
  // Scoped to the tab bar button on purpose: a bare `by.label('Search')` also
  // matches the item's icon view, and `.atIndex(0)` would then compare whichever
  // of the two the hierarchy traversal happened to return first.
  const target = tabBarButtonLabelled(tabLabel);
  await waitUntilExists(target);

  const readFrameX = async () => {
    // `.atIndex(0)` narrows the action target but not `getAttributes()`, which
    // still reports every match — so unwrap the multi-element shape.
    const attrs = (await target.getAttributes()) as
      | IosElementAttributes
      | { elements: IosElementAttributes[] };
    const frame = 'frame' in attrs ? attrs.frame : attrs.elements[0]?.frame;
    if (!frame) {
      throw new Error(`Could not read frame for tab labelled "${tabLabel}"`);
    }
    return frame.x;
  };

  // The tab bar can still be animating into its new layout, so only compare a
  // frame that two consecutive reads agree on.
  const giveUpAt = Date.now() + SETTLE_TIMEOUT;
  let previous = await readFrameX();
  for (;;) {
    await sleep(FRAME_POLL_INTERVAL);
    const current = await readFrameX();
    if (current === previous) {
      return current;
    }
    if (Date.now() >= giveUpAt) {
      throw new Error(
        `Tab bar item "${tabLabel}" frame.x never settled ` +
          `(last reads: ${previous} -> ${current})`,
      );
    }
    previous = current;
  }
}

/**
 * Puts a describe block on the Runtime Config tab in its INITIAL_CONFIG state,
 * so it starts from a known point instead of inheriting whatever the previous
 * block left behind. Without this a single failure cascades into every later
 * block and the suite reads as flaky rather than broken at one point.
 *
 * The reload is what makes this work: remounting restores INITIAL_CONFIG *and*
 * restores the tab bar item's testID, which a config change would otherwise have
 * stripped — leaving no stable way to address the tab.
 */
async function resetRuntimeConfig() {
  await device.reloadReactNative();
  await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-system-item-ios');
  await selectTab(TAB_RUNTIME_CONFIG);
  await waitUntilVisible(configSystemItem('favorites'));
  await waitUntilVisible(configTitle('undefined (system)'));
  await waitUntilVisible(configIcon('system (from systemItem)'));
}

describeIfiOS('Tab Bar System Item', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-system-item-ios');
  });
  describe('Static System Item tab', () => {
    it('should display the tab bar with system item titles and icons', async () => {
      await waitUntilVisible(element(by.type(CLASS_NAME_UI_TAB_BAR)));
      await expect(element(by.text('Static System Item'))).toBeVisible();
      await expect(element(by.id(STATIC_SYSTEM_ITEM_TAB_TEST_ID))).toHaveLabel(
        'Bookmarks',
      );
      await expect(
        element(by.id(PRISTINE_RUNTIME_CONFIG_TAB_TEST_ID)),
      ).toHaveLabel('Favorites');
      await expect(
        element(by.id('book.fill').and(by.label('bookmark'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).toExist();
    });

    it('tab bar item icon and title should remain the same when switching between tabs', async () => {
      await selectTab(TAB_RUNTIME_CONFIG);
      await waitUntilVisible(element(by.text('Runtime Config')));
      await waitUntilExists(
        element(by.id('book.fill').and(by.label('bookmark'))).atIndex(0),
      );
      await expect(element(by.id(STATIC_SYSTEM_ITEM_TAB_TEST_ID))).toHaveLabel(
        'Bookmarks',
      );

      await selectTab(TAB_STATIC_SYSTEM_ITEM);
      await waitUntilVisible(element(by.text('Static System Item')));
      await waitUntilExists(
        element(by.id('book.fill').and(by.label('bookmark'))).atIndex(0),
      );
      await expect(element(by.id(STATIC_SYSTEM_ITEM_TAB_TEST_ID))).toHaveLabel(
        'Bookmarks',
      );
    });
  });

  describe('Runtime Config tab — initial state', () => {
    // Deliberately not reset: this block asserts the pristine INITIAL_CONFIG,
    // which resetting would manufacture rather than observe.
    beforeAll(async () => {
      await selectTab(TAB_RUNTIME_CONFIG);
    });

    it('should display the Runtime Config screen content', async () => {
      await waitUntilVisible(element(by.text('Runtime Config')));
      await expect(element(by.text("systemItem: 'favorites'"))).toBeVisible();
      await expect(element(by.text('title: undefined (system)'))).toBeVisible();
      await expect(
        element(by.text('icon: system (from systemItem)')),
      ).toBeVisible();
      await expect(element(by.id('system-item-selector'))).toBeVisible();
      await expect(element(by.text('favorites'))).toBeVisible();
      await expect(element(by.text('history'))).toBeVisible();
      await expect(element(by.text('search'))).toBeVisible();

      await expect(element(by.id('title-selector'))).toBeVisible();
      await expect(element(by.text('custom'))).toBeVisible();
      await expect(element(by.text('hidden'))).toBeVisible();

      await expect(element(by.id('icon-selector'))).toBeVisible();
      await expect(element(by.text('house'))).toBeVisible();
      await expect(element(by.text('heart'))).toBeVisible();

      await expect(
        element(by.id(PRISTINE_RUNTIME_CONFIG_TAB_TEST_ID)),
      ).toHaveLabel('Favorites');
      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).toExist();
    });
  });

  describe('Runtime Config tab — systemItem cycling', () => {
    beforeAll(resetRuntimeConfig);

    it('should update the tab bar item when switching to history systemItem', async () => {
      await expect(element(by.text('Runtime Config'))).toBeVisible();
      await setSystemItemOption('history');
      await waitUntilExists(configSystemItem('history'));

      await waitUntilExists(tabBarButtonLabelled('History'));
      await waitUntilExists(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      );
      await waitUntilGone(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      );
    });

    it('should update the tab bar item when switching to search systemItem', async () => {
      const frameXBeforeSearch = await getTabBarItemFrameX('History');
      await setSystemItemOption('search');
      await waitUntilVisible(configSystemItem('search'));

      await waitUntilExists(element(by.label('Search')));
      await waitUntilExists(
        element(by.id('magnifyingglass').and(by.label('Search'))).atIndex(0),
      );
      await waitUntilGone(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      );

      if (!isIOSVersionAtLeast(`26.0`)) {
        await expect(
          element(by.label('Search').and(by.type(tabBarButtonType))),
        ).toBeVisible();
      }

      const frameXAfterSearch = await getTabBarItemFrameX('Search');

      if (isIOSVersionAtLeast(`26.0`)) {
        jestExpect(frameXAfterSearch).toBeGreaterThan(frameXBeforeSearch);
      } else {
        jestExpect(frameXAfterSearch).toEqual(frameXBeforeSearch);
      }
    });

    it('should update the tab bar item when switching to favorites systemItem', async () => {
      const frameXBeforeFavorites = await getTabBarItemFrameX('Search');
      await setSystemItemOption('favorites');
      await waitUntilVisible(configSystemItem('favorites'));

      await waitUntilExists(element(by.label('Favorites')));
      await waitUntilExists(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      );
      await waitUntilGone(
        element(by.id('magnifyingglass').and(by.label('Search'))).atIndex(0),
      );

      const frameXAfterFavorites = await getTabBarItemFrameX('Favorites');

      if (isIOSVersionAtLeast(`26.0`)) {
        jestExpect(frameXAfterFavorites).toBeLessThan(frameXBeforeFavorites);
      } else {
        jestExpect(frameXAfterFavorites).toEqual(frameXBeforeFavorites);
      }
    });
  });

  describe('Runtime Config tab — title override cycling', () => {
    beforeAll(resetRuntimeConfig);

    it('should update the tab bar item label when switching to custom title', async () => {
      await expect(element(by.text("systemItem: 'favorites'"))).toBeVisible();
      await expect(element(by.text('title: undefined (system)'))).toBeVisible();
      await expect(
        element(by.text('icon: system (from systemItem)')),
      ).toBeVisible();

      await setTitleOption('custom');
      await waitUntilVisible(configTitle('"Custom"'));

      if (isIOSVersionAtLeast(`26.0`)) {
        await waitUntilExists(tabBarButtonLabelled('Custom'));
        // Asserted on the rendered label text, not on the button's
        // accessibility label: iOS 26 keeps a second tab bar in the hierarchy
        // whose `_UITabButton` still reports the old label ("Favorites") long
        // after its own label view has been updated to "Custom".
        await waitUntilGone(element(by.text('Favorites')));
      } else {
        await waitUntilVisible(tabBarButtonLabelled('Custom'));
      }

      await waitUntilExists(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      );
    });

    it('should hide the tab bar item label when switching to hidden title', async () => {
      await setTitleOption('hidden');
      await waitUntilVisible(configTitle("'' (hidden)"));

      await waitUntilGone(
        element(by.label('Custom').and(by.type(tabBarButtonType))),
      );

      if (isIOSVersionAtLeast(`26.0`)) {
        await waitUntilExists(tabBarButtonLabelled('favorite'));
      } else {
        await waitUntilExists(
          element(
            by.label('').and(by.type(CLASS_NAME_UI_TAB_BAR_BUTTON_LABEL)),
          ),
        );
      }

      await waitUntilExists(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      );
    });

    it('should update the tab bar item label when restoring system title', async () => {
      await setTitleOption('system');
      await waitUntilVisible(configTitle('undefined (system)'));

      if (isIOSVersionAtLeast(`26.0`)) {
        await waitUntilExists(tabBarButtonLabelled('Favorites'));
      } else {
        await waitUntilVisible(tabBarButtonLabelled('Favorites'));
      }

      await waitUntilExists(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      );
    });
  });

  describe('Runtime Config tab — icon override cycling', () => {
    beforeAll(resetRuntimeConfig);

    it('should update tab bar item icon when switching to house icon', async () => {
      await setIconOption('house');
      await waitUntilVisible(configIcon("custom 'house'"));
      await waitUntilExists(
        element(by.id('house').and(by.label('home'))).atIndex(0),
      );
      await waitUntilGone(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      );
    });

    it('should navigate to Bookmarks and back while house icon override is active', async () => {
      await selectTab(TAB_STATIC_SYSTEM_ITEM);
      await waitUntilVisible(element(by.text('Static System Item')));
      await waitUntilExists(
        element(by.id('house').and(by.label('home'))).atIndex(0),
      );
      await waitUntilExists(
        element(by.id('book.fill').and(by.label('bookmark'))).atIndex(0),
      );
      await expect(element(by.id(STATIC_SYSTEM_ITEM_TAB_TEST_ID))).toHaveLabel(
        'Bookmarks',
      );

      // Only the icon was overridden, so the tab still carries its system title.
      await selectTab(runtimeConfigTabLabelled('Favorites'));
      await waitUntilVisible(configIcon("custom 'house'"));
      await waitUntilExists(
        element(by.id('house').and(by.label('home'))).atIndex(0),
      );
    });

    it('should update tab bar item icon when switching to heart icon', async () => {
      await setIconOption('heart');
      await waitUntilVisible(configIcon("custom 'heart'"));

      await waitUntilExists(
        element(by.id('heart').and(by.label('love'))).atIndex(0),
      );
      await waitUntilGone(element(by.id('house').and(by.label('home'))));
    });

    it('should update tab bar item icon when restoring system icon', async () => {
      await setIconOption('system');
      await waitUntilVisible(configIcon('system (from systemItem)'));

      await waitUntilExists(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      );
      await waitUntilGone(
        element(by.id('heart').and(by.label('love'))).atIndex(0),
      );
    });
  });

  describe('Runtime Config tab — combined overrides', () => {
    beforeAll(resetRuntimeConfig);

    it('should update tab bar item with combined selection of search systemItem + custom title + heart icon', async () => {
      const frameXBeforeSearch = await getTabBarItemFrameX('Favorites');

      await setSystemItemOption('search');
      await setTitleOption('custom');
      await setIconOption('heart');

      await waitUntilVisible(configSystemItem('search'));
      await waitUntilVisible(configTitle('"Custom"'));
      await waitUntilVisible(configIcon("custom 'heart'"));

      await waitUntilGone(element(by.label('Search')));
      await waitUntilExists(tabBarButtonLabelled('Custom'));
      await waitUntilExists(
        element(by.id('heart').and(by.label('love'))).atIndex(0),
      );
      await waitUntilGone(
        element(by.id('magnifyingglass').and(by.label('Search'))).atIndex(0),
      );

      const frameXAfterSearch = await getTabBarItemFrameX('Custom');

      if (isIOSVersionAtLeast(`26.0`)) {
        jestExpect(frameXAfterSearch).toBeGreaterThan(frameXBeforeSearch);
      } else {
        jestExpect(frameXAfterSearch).toEqual(frameXBeforeSearch);
      }
    });

    it('should navigate to the Bookmarks tab and back with combined overrides active', async () => {
      const frameXBeforeSwitch = await getTabBarItemFrameX('Custom');

      await selectTab(TAB_STATIC_SYSTEM_ITEM);
      await waitUntilVisible(element(by.text('Static System Item')));
      const frameXAfterSwitch = await getTabBarItemFrameX('Custom');
      jestExpect(frameXAfterSwitch).toEqual(frameXBeforeSwitch);
      await selectTab(runtimeConfigTabLabelled('Custom'));

      await waitUntilVisible(configSystemItem('search'));
      await waitUntilVisible(configTitle('"Custom"'));
      await waitUntilVisible(configIcon("custom 'heart'"));
    });

    it('should retain custom title and heart icon when switching to history systemItem', async () => {
      const frameXBeforeHistory = await getTabBarItemFrameX('Custom');

      await setSystemItemOption('history');

      await waitUntilVisible(configSystemItem('history'));
      await waitUntilVisible(configTitle('"Custom"'));
      await waitUntilVisible(configIcon("custom 'heart'"));

      await waitUntilExists(tabBarButtonLabelled('Custom'));

      await waitUntilGone(
        element(by.label('History').and(by.type(tabBarButtonType))),
      );

      await waitUntilExists(
        element(by.id('heart').and(by.label('love'))).atIndex(0),
      );
      await waitUntilGone(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      );

      const frameXAfterHistory = await getTabBarItemFrameX('Custom');

      if (isIOSVersionAtLeast(`26.0`)) {
        jestExpect(frameXAfterHistory).toBeLessThan(frameXBeforeHistory);
      } else {
        jestExpect(frameXAfterHistory).toEqual(frameXBeforeHistory);
      }
    });

    it('should fall back to system history icon when switching icon to system', async () => {
      await setIconOption('system');

      await waitUntilVisible(configSystemItem('history'));
      await waitUntilVisible(configTitle('"Custom"'));
      await waitUntilVisible(configIcon('system (from systemItem)'));

      await waitUntilGone(element(by.label('History')));
      await waitUntilExists(tabBarButtonLabelled('Custom'));

      await waitUntilExists(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      );
      await waitUntilGone(
        element(by.id('heart').and(by.label('love'))).atIndex(0),
      );
    });

    it('should hide the tab bar label when switching title to hidden', async () => {
      await setTitleOption('hidden');

      await waitUntilVisible(configSystemItem('history'));
      await waitUntilVisible(configTitle("'' (hidden)"));
      await waitUntilVisible(configIcon('system (from systemItem)'));

      if (isIOSVersionAtLeast(`26.0`)) {
        await waitUntilGone(
          element(by.label('History').and(by.type(tabBarButtonType))),
        );
      } else {
        await waitUntilExists(
          element(
            by.label('').and(by.type(CLASS_NAME_UI_TAB_BAR_BUTTON_LABEL)),
          ),
        );
      }

      await waitUntilExists(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      );
      await waitUntilGone(
        element(by.label('Custom').and(by.type(tabBarButtonType))),
      );
    });

    it('should restore the system localized title when switching title to system', async () => {
      await setTitleOption('system');

      await waitUntilVisible(configSystemItem('history'));
      await waitUntilVisible(element(by.text('title: undefined (system)')));
      await waitUntilVisible(configIcon('system (from systemItem)'));

      await waitUntilExists(element(by.label('History')));
      await waitUntilExists(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      );
    });
  });
});
