import { device, expect, element, by } from 'detox';
import {
  describeIfiOS,
  forceTapByLabeliOS,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

async function tapOptionButton(optionText: string) {
  await element(by.text(optionText)).tap();
}

async function tapSystemTitleOption() {
  await element(by.text('system')).atIndex(0).tap();
}

async function tapSystemIconOption() {
  await element(by.text('system')).atIndex(1).tap();
}

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

      await expect(element(by.label('History'))).toExist();
      await expect(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).not.toExist();
    });

    it('should update the tab bar item when switching to search systemItem', async () => {
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
    });

    it('should update the tab bar item when switching to favorites systemItem', async () => {
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
    });
  });

  describe('Runtime Config tab — title override cycling', () => {
    it('should update the tab bar item label after tapping custom title', async () => {
      await expect(element(by.text("systemItem: 'favorites'"))).toBeVisible();
      await expect(element(by.text('title: undefined (system)'))).toBeVisible();
      await expect(
        element(by.text('icon: system (from systemItem)')),
      ).toBeVisible();

      await tapOptionButton('custom');
      await expect(
        element(by.id('config-title').and(by.label('title: "Custom"'))),
      ).toBeVisible();

      await expect(
        element(by.label('Custom').and(by.type('_UITabButton'))),
      ).toExist();
      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).toExist();
    });

    it('should hide the tab bar item label after tapping hidden title', async () => {
      await tapOptionButton('hidden');
      await expect(
        element(by.id('config-title').and(by.label("title: '' (hidden)"))),
      ).toBeVisible();
      await expect(
        element(by.label('Custom').and(by.type('_UITabButton'))),
      ).not.toExist();
      await expect(
        element(by.label('favorite').and(by.type('_UITabButton'))),
      ).toExist();
      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).toExist();
    });

    it('should update the tab bar item label after restoring system title', async () => {
      await tapSystemTitleOption();
      await expect(
        element(
          by.id('config-title').and(by.label('title: undefined (system)')),
        ),
      ).toBeVisible();
      await expect(
        element(by.label('Favorites').and(by.type('_UITabButton'))),
      ).toExist();
      await expect(
        element(by.id('star.fill').and(by.label('favorite'))).atIndex(0),
      ).toExist();
    });
  });

  describe('Runtime Config tab — icon override cycling', () => {
    it('should update tab bar item icon after tapping house icon', async () => {
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

    it('should update tab bar item icon after tapping heart icon', async () => {
      await tapOptionButton('heart');
      await expect(
        element(by.id('config-icon').and(by.label("icon: custom 'heart'"))),
      ).toBeVisible();

      await expect(
        element(by.id('heart').and(by.label('love'))).atIndex(0),
      ).toExist();
      await expect(element(by.id('house').and(by.label('home')))).not.toExist();
    });

    it('should update tab bar item icon after restoring system icon', async () => {
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
        element(by.label('Custom').and(by.type('_UITabButton'))),
      ).toExist();
      await expect(
        element(by.id('heart').and(by.label('love'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('magnifyingglass').and(by.label('Search'))).atIndex(0),
      ).not.toExist();
    });

    it('should navigate to the Bookmarks tab and back with combined overrides active', async () => {
      await element(by.label('Bookmarks')).atIndex(0).tap();
      await expect(element(by.text('Static System Item'))).toBeVisible();

      await element(by.id('heart').and(by.label('love')))
        .atIndex(0)
        .tap();

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

    it('should retain custom title and heart icon after switching to history systemItem', async () => {
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
        element(by.label('Custom').and(by.type('_UITabButton'))),
      ).toExist();
      await expect(element(by.label('History'))).not.toExist();

      await expect(
        element(by.id('heart').and(by.label('love'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      ).not.toExist();
    });

    it('should fall back to system history icon when icon is set to system', async () => {
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
        element(by.label('Custom').and(by.type('_UITabButton'))),
      ).toExist();

      await expect(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.id('heart').and(by.label('love'))).atIndex(0),
      ).not.toExist();
    });

    it('should hide the tab bar label when title is set to hidden', async () => {
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

      await expect(element(by.label('History'))).not.toExist();

      await expect(
        element(by.id('clock.fill').and(by.label('clock'))).atIndex(0),
      ).toExist();
      await expect(
        element(by.label('Custom').and(by.type('_UITabButton'))),
      ).not.toExist();
    });

    it('should restore the system localized title when title is set to system', async () => {
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
