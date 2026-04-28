import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '../../e2e-utils';

// Re-tapping an already-selected tab does not trigger the reselect event on iOS 26.2+,
// making scrollToTop untestable via Detox on that platform.
const describeAndroid =
  device.getPlatform() === 'android' ? describe : describe.skip;

describeAndroid('Tabs specialEffects — scrollToTop', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-special-effects');
  });

  it('should display three tabs and Tab1 scrollable list on load', async () => {
    await expect(element(by.id('tab1-scrollview'))).toBeVisible();
    await expect(element(by.id('tab1-tab-item'))).toBeVisible();
    await expect(element(by.id('tab2-tab-item'))).toBeVisible();
    await expect(element(by.id('tab3-tab-item'))).toBeVisible();
    await expect(element(by.id('tab1-item-1'))).toBeVisible();
  });

  it('Tab1 (scrollToTop: true) — re-tapping active tab scrolls list back to top', async () => {
    await element(by.id('tab1-scrollview')).scroll(300, 'down', NaN, 0.85);
    await expect(element(by.id('tab1-item-1'))).not.toBeVisible();

    await element(by.id('tab1-tab-item')).tap();

    await waitFor(element(by.id('tab1-item-1')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('Tab2 (scrollToTop: false) — re-tapping active tab preserves scroll position', async () => {
    await element(by.id('tab2-tab-item')).tap();
    await expect(element(by.id('tab2-item-1'))).toBeVisible();

    await element(by.id('tab2-scrollview')).scroll(300, 'down', NaN, 0.85);
    await expect(element(by.id('tab2-item-1'))).not.toBeVisible();

    await element(by.id('tab2-tab-item')).tap();

    await expect(element(by.id('tab2-item-1'))).not.toBeVisible();
  });

  it('Tab3 (no specialEffects) — re-tapping active tab scrolls list back to top', async () => {
    await element(by.id('tab3-tab-item')).tap();
    await expect(element(by.id('tab3-item-1'))).toBeVisible();

    await element(by.id('tab3-scrollview')).scroll(300, 'down', NaN, 0.85);
    await expect(element(by.id('tab3-item-1'))).not.toBeVisible();

    await element(by.id('tab3-tab-item')).tap();

    await waitFor(element(by.id('tab3-item-1')))
      .toBeVisible()
      .withTimeout(3000);
  });

  it('Tab1 (scrollToTop: true) — switching away and back preserves scroll position', async () => {
    await element(by.id('tab1-tab-item')).tap();
    await expect(element(by.id('tab1-item-1'))).toBeVisible();

    await element(by.id('tab1-scrollview')).scroll(300, 'down', NaN, 0.85);
    await expect(element(by.id('tab1-item-1'))).not.toBeVisible();

    await element(by.id('tab3-tab-item')).tap();
    await expect(element(by.id('tab3-item-1'))).toBeVisible();

    await element(by.id('tab1-tab-item')).tap();

    await expect(element(by.id('tab1-item-1'))).not.toBeVisible();
  });
});
