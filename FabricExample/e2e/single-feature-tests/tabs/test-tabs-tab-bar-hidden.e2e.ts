import { device, expect, element, by } from 'detox';
import {
  describeIfiPad,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import {
  CLASS_NAME_UI_TAB_BAR,
  CLASS_NAME_UI_FLOATING_TAB_BAR_COLLECTION_VIEW,
} from '../../native-class-names';

describe('Tab Bar Hidden', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-tab-bar-hidden');
  });

  it('screen should be displayed', async () => {
    await expect(element(by.id('tab-bar-hidden-switch'))).toBeVisible();
    await expect(element(by.id('tab-bar-hidden-scrollview'))).toBeVisible();
  });

  it('tab bar should be visible by default after loading screen', async () => {
    await expect(element(by.label('tabBarHidden: false'))).toExist();
    // On iOS, we need to check for the whole tab bar visibility as view hierarchy shows individual tab bar items as exist and visible even when UITabBar is invisible. On Android, we can check for the individual tab bar item visibility as they are hidden together with the tab bar.
    if (device.getPlatform() === 'ios') {
      await expect(element(by.type(CLASS_NAME_UI_TAB_BAR))).toBeVisible();
    } else {
      await expect(element(by.id('tab-bar-item-1-id'))).toBeVisible();
    }
  });

  it('tab bar should be hidden after changing tabBarHidden value to true', async () => {
    await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel(
      'tabBarHidden: false',
    );
    await element(by.id('tab-bar-hidden-switch')).tap();
    await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel(
      'tabBarHidden: true',
    );
    if (device.getPlatform() === 'ios') {
      await expect(element(by.type(CLASS_NAME_UI_TAB_BAR))).not.toBeVisible();
    } else {
      await expect(element(by.id('tab-bar-item-1-id'))).not.toBeVisible();
    }
  });

  // Android-only. The bar is hidden there by setting its visibility to `GONE`,
  // which leaves the bounds it was last laid out with in place. React Native
  // hit-tests the native view tree without looking at visibility, so those
  // retained bounds used to swallow every touch aimed at the strip the bar had
  // occupied. See #4132. iOS does not hide the tab bar this way.
  it('content in the strip freed by the hidden tab bar should receive touches', async () => {
    if (device.getPlatform() !== 'android') {
      return;
    }

    await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel(
      'tabBarHidden: true',
    );
    await expect(element(by.id('tab-bar-hidden-press-count'))).toHaveText(
      'Bottom presses: 0',
    );

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

  it('tab bar should reappear after changing tabBarHidden value to false', async () => {
    await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel(
      'tabBarHidden: true',
    );
    await element(by.id('tab-bar-hidden-switch')).tap();
    await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel(
      'tabBarHidden: false',
    );
    if (device.getPlatform() === 'ios') {
      await expect(element(by.type(CLASS_NAME_UI_TAB_BAR))).toBeVisible();
    } else {
      await expect(element(by.id('tab-bar-item-1-id'))).toBeVisible();
    }
  });
});

describeIfiPad('@ipad Tabs: tabBarHidden (iPad)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-tab-bar-hidden');
  });

  it('screen should be displayed', async () => {
    await expect(element(by.id('tab-bar-hidden-switch'))).toBeVisible();
    await expect(element(by.id('tab-bar-hidden-scrollview'))).toBeVisible();
  });

  it('tab bar should be visible by default after loading screen', async () => {
    await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel(
      'tabBarHidden: false',
    );
    await expect(
      element(by.type(CLASS_NAME_UI_FLOATING_TAB_BAR_COLLECTION_VIEW)),
    ).toBeVisible();
  });

  it('tab bar should be hidden after changing tabBarHidden value to true', async () => {
    await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel(
      'tabBarHidden: false',
    );
    await element(by.id('tab-bar-hidden-switch')).tap();
    await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel(
      'tabBarHidden: true',
    );
    await expect(
      element(by.type(CLASS_NAME_UI_FLOATING_TAB_BAR_COLLECTION_VIEW)),
    ).not.toBeVisible();
  });

  it('tab bar should reappear after changing tabBarHidden value to false', async () => {
    await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel(
      'tabBarHidden: true',
    );
    await element(by.id('tab-bar-hidden-switch')).tap();
    await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel(
      'tabBarHidden: false',
    );
    await expect(
      element(by.type(CLASS_NAME_UI_FLOATING_TAB_BAR_COLLECTION_VIEW)),
    ).toBeVisible();
  });
});
