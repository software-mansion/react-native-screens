import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { IosElementAttributes } from 'detox/detox';
import { selectSingleFeatureTestsScreen, describeIfiOS } from '../../e2e-utils';
import isVersionEqualOrHigherThan from '../../helpers/isVersionEqualOrHigherThan';
const {
  getIOSVersionNumber,
} = require('../../../../scripts/e2e/ios-devices.js');

async function tapOptionButton(optionText: string) {
  await element(by.text(optionText)).tap();
}

async function getTabBarItemFrameX(tabLabel: string): Promise<number> {
  const attrs = (await element(by.label(tabLabel))
    .atIndex(0)
    .getAttributes()) as
    | IosElementAttributes
    | { elements: IosElementAttributes[] };
  const frame = 'frame' in attrs ? attrs.frame : attrs.elements[0]?.frame;
  if (!frame) {
    throw new Error(`Could not read frame for tab labelled "${tabLabel}"`);
  }
  return frame.x;
}

async function tapSystemTitleOption() {
  await element(by.text('system')).atIndex(0).tap();
}

async function tapSystemIconOption() {
  await element(by.text('system')).atIndex(1).tap();
}
function isIOSVersionAtLeast(version: string): boolean {
  return (
    device.getPlatform() === 'ios' &&
    isVersionEqualOrHigherThan(getIOSVersionNumber(), version)
  );
}

const tabBarButtonType = isIOSVersionAtLeast('26.0')
  ? '_UITabButton'
  : 'UITabBarButton';

describeIfiOS('Tab Bar System Item', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-system-item-ios');
  });
  describe('Static System Item tab', () => {
    it('should display the tab bar with system item titles and icons', async () => {
      await expect(element(by.type('UITabBar'))).toBeVisible();
      await expect(element(by.text('Static System Item'))).toBeVisible();
      await expect(element(by.id('bookmark-tab-item'))).toHaveLabel(
        'Bookmarks',
      );
      await expect(element(by.id('custom-tab-item'))).toHaveLabel('Favorites');
      await expect(
        element(by.id('book.fill').and(by.label('bookmark'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).toExist();
    });

    it('tab bar item icon and title should remain the same when switching between tabs', async () => {
      await element(by.id('custom-tab-item')).tap();
      await expect(element(by.text('Runtime Config'))).toBeVisible();
      await expect(
        element(by.id('book.fill').and(by.label('bookmark'))).atIndex(0),
      ).toExist();
      await expect(element(by.id('bookmark-tab-item'))).toHaveLabel(
        'Bookmarks',
      );

      await element(by.id('bookmark-tab-item')).tap();
      await expect(element(by.text('Static System Item'))).toBeVisible();
      await expect(
        element(by.id('book.fill').and(by.label('bookmark'))).atIndex(0),
      ).toExist();
      await expect(element(by.id('bookmark-tab-item'))).toHaveLabel(
        'Bookmarks',
      );
    });
  });

  describe('Runtime Config tab — initial state', () => {
    beforeAll(async () => {
      await element(by.id('custom-tab-item')).tap();
    });

    it('should display the Runtime Config screen content', async () => {
      await expect(element(by.text('Runtime Config'))).toBeVisible();
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

      await expect(element(by.id('custom-tab-item'))).toHaveLabel('Favorites');
      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).toExist();
    });
  });

  describe('Runtime Config tab — systemItem cycling', () => {
    it('should update the tab bar item when switching to history systemItem', async () => {
      await expect(element(by.text('Runtime Config'))).toBeVisible();
      await tapOptionButton('history');
      await expect(
        element(
          by.id('config-systemitem').and(by.label("systemItem: 'history'")),
        ),
      ).toExist();

      await expect(
        element(by.label('History').and(by.type(tabBarButtonType))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).not.toExist();
    });

    it('should update the tab bar item when switching to search systemItem', async () => {
      const frameXBeforeSearch = await getTabBarItemFrameX('History');
      await tapOptionButton('search');
      await expect(
        element(
          by.id('config-systemitem').and(by.label("systemItem: 'search'")),
        ),
      ).toBeVisible();

      await expect(element(by.label('Search'))).toExist();
      await expect(
        element(by.id('magnifyingglass').and(by.label('Search'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      ).not.toExist();

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
      await tapOptionButton('favorites');
      await expect(
        element(
          by.id('config-systemitem').and(by.label("systemItem: 'favorites'")),
        ),
      ).toBeVisible();

      await expect(element(by.label('Favorites'))).toExist();
      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('magnifyingglass').and(by.label('Search'))).atIndex(0),
      ).not.toExist();

      const frameXAfterFavorites = await getTabBarItemFrameX('Favorites');

      if (isIOSVersionAtLeast(`26.0`)) {
        jestExpect(frameXAfterFavorites).toBeLessThan(frameXBeforeFavorites);
      } else {
        jestExpect(frameXAfterFavorites).toEqual(frameXBeforeFavorites);
      }
    });
  });

  describe('Runtime Config tab — title override cycling', () => {
    it('should update the tab bar item label when switching to custom title', async () => {
      await expect(element(by.text("systemItem: 'favorites'"))).toBeVisible();
      await expect(element(by.text('title: undefined (system)'))).toBeVisible();
      await expect(
        element(by.text('icon: system (from systemItem)')),
      ).toBeVisible();

      await tapOptionButton('custom');
      await expect(
        element(by.id('config-title').and(by.label('title: "Custom"'))),
      ).toBeVisible();

      if (isIOSVersionAtLeast(`26.0`)) {
        await expect(
          element(by.label('Custom').and(by.type(tabBarButtonType))),
        ).toExist();
        await expect(
          element(by.label('Favorites').and(by.type(tabBarButtonType))),
        ).not.toExist();
      } else {
        await expect(
          element(by.label('Custom').and(by.type(tabBarButtonType))).atIndex(0),
        ).toBeVisible();
      }

      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).toExist();
    });

    it('should hide the tab bar item label when switching to hidden title', async () => {
      await tapOptionButton('hidden');
      await expect(
        element(by.id('config-title').and(by.label("title: '' (hidden)"))),
      ).toBeVisible();

      await expect(
        element(by.label('Custom').and(by.type(tabBarButtonType))),
      ).not.toExist();

      if (isIOSVersionAtLeast(`26.0`)) {
        await expect(
          element(by.label('favorite').and(by.type(tabBarButtonType))),
        ).toExist();
      } else {
        await expect(
          element(by.label('').and(by.type('UITabBarButtonLabel'))),
        ).toExist();
      }

      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).toExist();
    });

    it('should update the tab bar item label when restoring system title', async () => {
      await tapSystemTitleOption();
      await expect(
        element(
          by.id('config-title').and(by.label('title: undefined (system)')),
        ),
      ).toBeVisible();
      if (isIOSVersionAtLeast(`26.0`)) {
        await expect(
          element(by.label('Favorites').and(by.type(tabBarButtonType))),
        ).toExist();
      } else {
        await expect(
          element(by.label('Favorites').and(by.type(tabBarButtonType))).atIndex(
            0,
          ),
        ).toBeVisible();
      }

      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).toExist();
    });
  });

  describe('Runtime Config tab — icon override cycling', () => {
    it('should update tab bar item icon when switching to house icon', async () => {
      await tapOptionButton('house');
      await expect(
        element(by.id('config-icon').and(by.label("icon: custom 'house'"))),
      ).toBeVisible();
      await expect(
        element(by.id('house').and(by.label('home'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).not.toExist();
    });

    it('should navigate to Bookmarks and back while house icon override is active', async () => {
      await element(by.label('Bookmarks')).atIndex(0).tap();
      await expect(element(by.text('Static System Item'))).toBeVisible();
      await expect(
        element(by.id('house').and(by.label('home'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('book.fill').and(by.label('bookmark'))).atIndex(0),
      ).toExist();
      await expect(element(by.id('bookmark-tab-item'))).toHaveLabel(
        'Bookmarks',
      );

      await element(by.label('Favorites')).atIndex(0).tap();
      await expect(
        element(by.id('config-icon').and(by.label("icon: custom 'house'"))),
      ).toBeVisible();
      await expect(
        element(by.id('house').and(by.label('home'))).atIndex(0),
      ).toExist();
    });

    it('should update tab bar item icon when switching to heart icon', async () => {
      await tapOptionButton('heart');
      await expect(
        element(by.id('config-icon').and(by.label("icon: custom 'heart'"))),
      ).toBeVisible();

      await expect(
        element(by.id('heart').and(by.label('love'))).atIndex(0),
      ).toExist();
      await expect(element(by.id('house').and(by.label('home')))).not.toExist();
    });

    it('should update tab bar item icon when restoring system icon', async () => {
      await tapSystemIconOption();
      await expect(
        element(
          by.id('config-icon').and(by.label('icon: system (from systemItem)')),
        ),
      ).toBeVisible();

      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('heart').and(by.label('love'))).atIndex(0),
      ).not.toExist();
    });
  });

  describe('Runtime Config tab — combined overrides', () => {
    it('should update tab bar item with combined selection of search systemItem + custom title + heart icon', async () => {
      const frameXBeforeSearch = await getTabBarItemFrameX('Favorites');

      await tapOptionButton('search');
      await tapOptionButton('custom');
      await tapOptionButton('heart');

      await expect(
        element(
          by.id('config-systemitem').and(by.label("systemItem: 'search'")),
        ),
      ).toBeVisible();
      await expect(
        element(by.id('config-title').and(by.label('title: "Custom"'))),
      ).toBeVisible();
      await expect(
        element(by.id('config-icon').and(by.label("icon: custom 'heart'"))),
      ).toBeVisible();

      await expect(element(by.label('Search'))).not.toExist();
      await expect(
        element(by.label('Custom').and(by.type(tabBarButtonType))),
      ).toExist();
      await expect(
        element(by.id('heart').and(by.label('love'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('magnifyingglass').and(by.label('Search'))).atIndex(0),
      ).not.toExist();

      const frameXAfterSearch = await getTabBarItemFrameX('Custom');

      if (isIOSVersionAtLeast(`26.0`)) {
        jestExpect(frameXAfterSearch).toBeGreaterThan(frameXBeforeSearch);
      } else {
        jestExpect(frameXAfterSearch).toEqual(frameXBeforeSearch);
      }
    });

    it('should navigate to the Bookmarks tab and back with combined overrides active', async () => {
      const frameXBeforeSwitch = await getTabBarItemFrameX('Custom');

      await element(by.label('Bookmarks')).atIndex(0).tap();
      await expect(element(by.text('Static System Item'))).toBeVisible();
      const frameXAfterSwitch = await getTabBarItemFrameX('Custom');
      jestExpect(frameXAfterSwitch).toEqual(frameXBeforeSwitch);
      await element(by.label('Custom')).atIndex(0).tap();

      await expect(
        element(
          by.id('config-systemitem').and(by.label("systemItem: 'search'")),
        ),
      ).toBeVisible();
      await expect(
        element(by.id('config-title').and(by.label('title: "Custom"'))),
      ).toBeVisible();
      await expect(
        element(by.id('config-icon').and(by.label("icon: custom 'heart'"))),
      ).toBeVisible();
    });

    it('should retain custom title and heart icon when switching to history systemItem', async () => {
      const frameXBeforeHistory = await getTabBarItemFrameX('Custom');

      await tapOptionButton('history');

      await expect(
        element(
          by.id('config-systemitem').and(by.label("systemItem: 'history'")),
        ),
      ).toBeVisible();
      await expect(
        element(by.id('config-title').and(by.label('title: "Custom"'))),
      ).toBeVisible();
      await expect(
        element(by.id('config-icon').and(by.label("icon: custom 'heart'"))),
      ).toBeVisible();

      await expect(
        element(by.label('Custom').and(by.type(tabBarButtonType))),
      ).toExist();

      await expect(
        element(by.label('History').and(by.type(tabBarButtonType))),
      ).not.toExist();

      await expect(
        element(by.id('heart').and(by.label('love'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      ).not.toExist();

      const frameXAfterHistory = await getTabBarItemFrameX('Custom');

      if (isIOSVersionAtLeast(`26.0`)) {
        jestExpect(frameXAfterHistory).toBeLessThan(frameXBeforeHistory);
      } else {
        jestExpect(frameXAfterHistory).toEqual(frameXBeforeHistory);
      }
    });

    it('should fall back to system history icon when switching icon to system', async () => {
      await tapSystemIconOption();

      await expect(
        element(
          by.id('config-systemitem').and(by.label("systemItem: 'history'")),
        ),
      ).toBeVisible();
      await expect(
        element(by.id('config-title').and(by.label('title: "Custom"'))),
      ).toBeVisible();
      await expect(
        element(
          by.id('config-icon').and(by.label('icon: system (from systemItem)')),
        ),
      ).toBeVisible();

      await expect(element(by.label('History'))).not.toExist();
      await expect(
        element(by.label('Custom').and(by.type(tabBarButtonType))),
      ).toExist();

      await expect(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('heart').and(by.label('love'))).atIndex(0),
      ).not.toExist();
    });

    it('should hide the tab bar label when switching title to hidden', async () => {
      await tapOptionButton('hidden');

      await expect(
        element(
          by.id('config-systemitem').and(by.label("systemItem: 'history'")),
        ),
      ).toBeVisible();
      await expect(
        element(by.id('config-title').and(by.label("title: '' (hidden)"))),
      ).toBeVisible();
      await expect(
        element(
          by.id('config-icon').and(by.label('icon: system (from systemItem)')),
        ),
      ).toBeVisible();

      if (isIOSVersionAtLeast(`26.0`)) {
        await expect(
          element(by.label('History').and(by.type(tabBarButtonType))),
        ).not.toExist();
      } else {
        await expect(
          element(by.label('').and(by.type('UITabBarButtonLabel'))),
        ).toExist();
      }

      await expect(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.label('Custom').and(by.type(tabBarButtonType))),
      ).not.toExist();
    });

    it('should restore the system localized title when switching title to system', async () => {
      await tapSystemTitleOption();

      await expect(
        element(
          by.id('config-systemitem').and(by.label("systemItem: 'history'")),
        ),
      ).toBeVisible();
      await expect(element(by.text('title: undefined (system)'))).toBeVisible();
      await expect(
        element(
          by.id('config-icon').and(by.label('icon: system (from systemItem)')),
        ),
      ).toBeVisible();

      await expect(element(by.label('History'))).toExist();
      await expect(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      ).toExist();
    });
  });
});
