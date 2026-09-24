import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '@e2e/app/test-screen-navigation';
import { describeIfAndroid } from '@e2e/framework/platform';

// The bar is hidden on Android by setting its visibility to `GONE`, which
// leaves the bounds it was last laid out with in place. React Native hit-tests
// the native view tree without looking at visibility, so those retained bounds
// used to swallow every touch aimed at the strip the bar had occupied.
// See #4132.
describeIfAndroid('Tab Bar Hidden Pressable Interaction', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-tab-bar-hidden-pressable-interaction',
    );
  });

  it('tab bar should be visible by default after loading screen', async () => {
    await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel(
      'tabBarHidden: false',
    );
    await expect(element(by.id('tab-bar-item-1-id'))).toBeVisible();
    await expect(element(by.id('tab-bar-hidden-press-count'))).toHaveText(
      'Bottom presses: 0',
    );
  });

  it('tab bar should be hidden after changing tabBarHidden value to true', async () => {
    await element(by.id('tab-bar-hidden-switch')).tap();
    await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel(
      'tabBarHidden: true',
    );
    await expect(element(by.id('tab-bar-item-1-id'))).not.toBeVisible();
  });

  it('content in the strip freed by the hidden tab bar should receive touches', async () => {
    // The Pressable is 120dp tall and anchored to the bottom of the screen, so
    // it covers both the strip the tab bar freed and the system navigation bar
    // below it. 40dp below its top edge is inside the strip - the bar is at
    // least 80dp tall plus the bottom system inset - and clear of the system
    // navigation bar, on which taps never reach the app.
    await element(by.id('tab-bar-hidden-bottom-pressable')).tap({
      x: 100,
      y: 40,
    });

    await expect(element(by.id('tab-bar-hidden-press-count'))).toHaveText(
      'Bottom presses: 1',
    );
  });
});
