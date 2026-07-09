import { device, expect, element, by } from 'detox';
import {
  scrollUntilVisible,
  selectComponentIntegrationTestsScreen,
  forceSelectTabByLabel,
  describeIfAndroid,
} from '../../e2e-utils';
import { UI_TAB_BAR_TYPE } from '../../native-type-names';

describe('SVM in Stack & Tabs - tabs special effects — scrollToTop: no nesting', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectComponentIntegrationTestsScreen(
      'ScrollViewMarkerIntegrationTests',
      'test-stack-svm-tabs-special-effects',
    );
  });

  it('should display tab bar and Home tab with scrollable view on load', async () => {
    await expect(element(by.id('home-scrollview'))).toBeVisible();
    if (device.getPlatform() === 'ios') {
      await expect(element(by.type(UI_TAB_BAR_TYPE))).toBeVisible();
    } else {
      await expect(element(by.id('home-tab-item'))).toBeVisible();
      await expect(element(by.id('stack-tab-item'))).toBeVisible();
    }
  });

  it('Re-tapping active Home tab scrolls scroll-view back to top', async () => {
    await scrollUntilVisible('Home-item-10', 'home-scrollview');
    await expect(element(by.id('Home-item-1'))).not.toBeVisible();

    await forceSelectTabByLabel('home-tab-item-label');

    await waitFor(element(by.id('Home-item-1')))
      .toBeVisible()
      .withTimeout(3000);
  });
});

describeIfAndroid(
  'SVM in Stack & Tabs - tabs special effects — scrollToTop: nested stack',
  () => {
    beforeAll(async () => {
      await device.reloadReactNative();
      await selectComponentIntegrationTestsScreen(
        'ScrollViewMarkerIntegrationTests',
        'test-stack-svm-tabs-special-effects',
      );
    });

    it('should display tab bar and Stack tab with scrollable view on load', async () => {
      await expect(element(by.id('home-scrollview'))).toBeVisible();
      await expect(element(by.id('home-tab-item'))).toBeVisible();
      await expect(element(by.id('stack-tab-item'))).toBeVisible();
      await element(by.id('stack-tab-item')).tap();
      await expect(element(by.id('stack-scrollview'))).toBeVisible();
    });

    it('Re-tapping active Stack tab scrolls scroll-view back to top', async () => {
      await scrollUntilVisible('Stack-item-10', 'stack-scrollview');
      await expect(element(by.id('Stack-item-1'))).not.toBeVisible();

      await forceSelectTabByLabel('stack-tab-item-label');

      await waitFor(element(by.id('Stack-item-1')))
        .toBeVisible()
        .withTimeout(3000);
    });
  },
);
