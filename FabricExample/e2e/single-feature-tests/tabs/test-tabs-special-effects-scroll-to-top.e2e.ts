import { device, expect, element, by } from 'detox';
import {
  selectSingleFeatureTestsScreen,
  forceTapByLabeliOS,
} from '../../e2e-utils';

/**
 * Selects a tab bar item. On iOS, this uses a forced coordinate tap to 
 * ensure the tab is selected even if it is obstructed by the iOS 26 Liquid Glass lens.
 */
async function forceSelectTabByLabel(label: string) {
  if (device.getPlatform() === 'ios') {
    await forceTapByLabeliOS(label);
  } else {
    await element(by.label(label)).tap();
  }
}

describe('Tabs specialEffects — scrollToTop', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-special-effects-scroll-to-top',
    );
  });

  it('should display tab bar and Tab1 scrollable list on load', async () => {
    await expect(element(by.id('tab1-scrollview'))).toBeVisible();
    await expect(element(by.id('tab1-item-1'))).toBeVisible();
    if (device.getPlatform() === 'ios') {
      await expect(element(by.type('UITabBar'))).toBeVisible();
    } else {
      await expect(element(by.id('tab1-tab-item'))).toBeVisible();
      await expect(element(by.id('tab2-tab-item'))).toBeVisible();
      await expect(element(by.id('tab3-tab-item'))).toBeVisible();
    }
  });

  it('Tab1 (scrollToTop: true) — re-tapping active tab scrolls list back to top', async () => {
    await element(by.id('tab1-scrollview')).scroll(300, 'down', NaN, 0.85);
    await expect(element(by.id('tab1-item-1'))).not.toBeVisible();

    await forceSelectTabByLabel('tab1-tab-item-label');

    await waitFor(element(by.id('tab1-item-1')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('Tab2 (scrollToTop: false) — re-tapping active tab preserves scroll position', async () => {
    await element(by.id('tab2-tab-item')).tap();
    await expect(element(by.id('tab2-item-1'))).toBeVisible();

    await element(by.id('tab2-scrollview')).scroll(300, 'down', NaN, 0.85);
    await expect(element(by.id('tab2-item-1'))).not.toBeVisible();

    await forceSelectTabByLabel('tab2-tab-item-label');

    await expect(element(by.id('tab2-item-1'))).not.toBeVisible();
  });

  it('Tab3 (no specialEffects) — re-tapping active tab scrolls list back to top', async () => {
    await element(by.id('tab3-tab-item')).tap();
    await expect(element(by.id('tab3-item-1'))).toBeVisible();

    await element(by.id('tab3-scrollview')).scroll(300, 'down', NaN, 0.85);
    await expect(element(by.id('tab3-item-1'))).not.toBeVisible();

    await forceSelectTabByLabel('tab3-tab-item-label');

    await waitFor(element(by.id('tab3-item-1')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('Tab1 (scrollToTop: true) — switching away and back preserves scroll position', async () => {
    await forceSelectTabByLabel('tab1-tab-item-label');
    await expect(element(by.id('tab1-item-1'))).toBeVisible();

    await element(by.id('tab1-scrollview')).scroll(300, 'down', NaN, 0.85);
    await expect(element(by.id('tab1-item-1'))).not.toBeVisible();

    await forceSelectTabByLabel('tab3-tab-item-label');
    await expect(element(by.id('tab3-item-1'))).toBeVisible();

    await forceSelectTabByLabel('tab1-tab-item-label');

    await expect(element(by.id('tab1-item-1'))).not.toBeVisible();
  });
});
