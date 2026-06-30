import { device, expect, element, by } from 'detox';
import {
  describeIfiOS,
  describeIfiPad,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

const PICKER_ID = 'tab-bar-controller-mode-picker';

type TabBarControllerMode = 'automatic' | 'tabBar' | 'tabSidebar';

function modeItemId(mode: TabBarControllerMode) {
  return `tabbarcontrollermode-${mode.toLowerCase()}`;
}

async function setTabBarControllerMode(mode: TabBarControllerMode) {
  await element(by.id(PICKER_ID)).tap();
  await element(by.id(modeItemId(mode))).tap();
  await expect(element(by.id(PICKER_ID))).toHaveLabel(
    `tabBarControllerMode: ${mode}`,
  );
  await element(by.id(PICKER_ID)).tap();
}

describeIfiPad('@ipad Tabs: tabBarControllerMode (iPad)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-tab-bar-controller-mode-ios',
    );
  });

  it('loads on Tab1 with the picker defaulting to automatic showing tab bar without sidebar toggle', async () => {
    await expect(element(by.id(PICKER_ID))).toBeVisible();
    await expect(element(by.id(PICKER_ID))).toHaveLabel(
      'tabBarControllerMode: automatic',
    );
    await expect(element(by.label('Toggle sidebar'))).not.toExist();
    await expect(
      element(by.type('_UIFloatingTabBarCollectionView')),
    ).toBeVisible();
  });

  it('tabBar mode the floating tab bar', async () => {
    await setTabBarControllerMode('tabBar');
    await expect(
      element(by.type('_UIFloatingTabBarCollectionView')),
    ).toBeVisible();
    await expect(element(by.label('Toggle sidebar'))).not.toExist();
    await expect(
      element(by.type('_UIListContentImageView')).atIndex(0),
    ).not.toExist();
  });

  it('tabSidebar mode enable sidebar option in the tab bar', async () => {
    await setTabBarControllerMode('tabSidebar');
    await expect(
      element(by.label('Toggle sidebar').and(by.type('UIButton'))),
    ).toBeVisible();
    await element(by.label('Toggle sidebar').and(by.type('UIButton'))).tap();
    await expect(
      element(by.type('_UIFloatingTabBarCollectionView')),
    ).not.toBeVisible();
    await expect(element(by.type('_UITabSidebarCollectionView'))).toExist();
    await expect(
      element(by.type('_UIListContentImageView')).atIndex(0),
    ).toExist();
    await element(by.type('RCTRootComponentView')).atIndex(0).tap();
    await expect(
      element(by.type('_UIFloatingTabBarCollectionView')),
    ).toBeVisible();
    await expect(element(by.type('_UITabSidebarCollectionView'))).not.toExist();
    await expect(
      element(by.type('_UIListContentImageView')).atIndex(0),
    ).not.toExist();
  });
});

describeIfiOS('Tabs: tabBarControllerMode (iPhone)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-tab-bar-controller-mode-ios',
    );
  });

  it('loads on Tab1 with the picker defaulting to automatic showing tab bar without sidebar toggle', async () => {
    await expect(element(by.id(PICKER_ID))).toBeVisible();
    await expect(element(by.id(PICKER_ID))).toHaveLabel(
      'tabBarControllerMode: automatic',
    );
    await expect(element(by.type('UITabBar'))).toBeVisible();
    await expect(element(by.label('Toggle sidebar'))).not.toExist();
  });

  it('tabBar mode the bottom tab bar visible', async () => {
    await setTabBarControllerMode('tabBar');
    await expect(element(by.type('UITabBar'))).toBeVisible();
    await expect(element(by.label('Toggle sidebar'))).not.toExist();
  });

  it('tabSidebar mode does not show side bar on iPhone', async () => {
    await setTabBarControllerMode('tabSidebar');
    await expect(element(by.type('UITabBar'))).toBeVisible();
    await expect(element(by.label('Toggle sidebar'))).not.toExist();
  });
});
