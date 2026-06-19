import { device, expect, element, by } from 'detox';
import {
  describeIfiPad,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

const PICKER_ID = 'tab-bar-controller-mode-picker';

type TabBarControllerMode = 'automatic' | 'tabBar' | 'tabSidebar';

// The SettingsPicker derives each item's testID from its label and value
// (see apps/src/shared/SettingsPicker.tsx): `${label}-${item}`.toLowerCase()
// with spaces replaced by dashes. The label here is "tabBarControllerMode".
function modeItemId(mode: TabBarControllerMode) {
  return `tabbarcontrollermode-${mode.toLowerCase()}`;
}

async function setTabBarControllerMode(mode: TabBarControllerMode) {
  // Open the dropdown, pick the value, then collapse it again. The picker
  // keeps the list open after selection, so we tap the label once more to
  // close it and keep it out of the way of subsequent assertions.
  await element(by.id(PICKER_ID)).tap();
  await element(by.id(modeItemId(mode))).tap();
  await expect(element(by.id(PICKER_ID))).toHaveLabel(
    `tabBarControllerMode: ${mode}`,
  );
  await element(by.id(PICKER_ID)).tap();
}

// iPad-only: tabBarControllerMode only diverges on iPad at regular width.
// `tabSidebar` renders a sidebar instead of the bottom UITabBar; on iPhone all
// three values collapse to a bottom tab bar, so there is nothing to assert
// there. This suite self-skips unless RNS_APPLE_SIM_NAME targets an iPad.
describeIfiPad('@smoke Tabs: tabBarControllerMode (iPad)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-tab-bar-controller-mode-ios',
    );
  });

  it('loads on Tab1 with the picker defaulting to automatic', async () => {
    await expect(element(by.id(PICKER_ID))).toBeVisible();
    await expect(element(by.id(PICKER_ID))).toHaveLabel(
      'tabBarControllerMode: automatic',
    );
    await expect(element(by.label('Toggle sidebar'))).not.toExist();
  });

  it('tabBar mode shows the bottom tab bar', async () => {
    await setTabBarControllerMode('tabBar');
    await expect(
      element(by.type('_UIFloatingTabBarCollectionView')),
    ).toBeVisible();
  });

  it('tabSidebar mode replaces the bottom tab bar with a sidebar', async () => {
    await setTabBarControllerMode('tabSidebar');
    await expect(element(by.label('Toggle sidebar'))).toExist();
    await expect(element(by.id(PICKER_ID))).toBeVisible();
    await element(by.label('Toggle sidebar').and(by.type('UIButton'))).tap();
    // await device.setOrientation('landscape');
    // await expect(element(by.type('NavigationBarPlatterContainer'))).toExist();
    await expect(
      element(by.type('_UIFloatingTabBarCollectionView')),
    ).not.toBeVisible();
    await element(by.id('Tab1Item')).tap();
    await expect(
      element(by.type('_UIFloatingTabBarCollectionView')),
    ).toBeVisible();
  });

  it('returns to the bottom tab bar when switching back to tabBar', async () => {
    await setTabBarControllerMode('tabBar');
    await expect(
      element(by.type('_UIFloatingTabBarCollectionView')),
    ).toBeVisible();
  });

  it('returns to the bottom tab bar when switching back to tabBar', async () => {
    await setTabBarControllerMode('tabBar');
    await expect(
      element(by.type('_UIFloatingTabBarCollectionView')),
    ).toBeVisible();
  });
});
