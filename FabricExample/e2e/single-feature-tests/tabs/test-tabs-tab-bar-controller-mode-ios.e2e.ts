import { device, expect, element, by } from 'detox';
import {
  describeIfiOS,
  describeIfiPad,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import {
  UI_FLOATING_TAB_BAR_COLLECTION_VIEW_TYPE,
  UI_TAB_SIDEBAR_COLLECTION_VIEW_TYPE,
  UI_BUTTON_TYPE,
  RCT_ROOT_COMPONENT_VIEW_TYPE,
  UI_TAB_BAR_TYPE,
  UI_LIST_CONTENT_IMAGE_VIEW_TYPE,
} from '../../native-type-names';

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
      element(by.type(UI_FLOATING_TAB_BAR_COLLECTION_VIEW_TYPE)),
    ).toBeVisible();
  });

  it('tabBar mode shows the floating tab bar', async () => {
    await setTabBarControllerMode('tabBar');
    await expect(
      element(by.type(UI_FLOATING_TAB_BAR_COLLECTION_VIEW_TYPE)),
    ).toBeVisible();
    await expect(element(by.label('Toggle sidebar'))).not.toExist();
    await expect(
      element(
        by
          .type(UI_LIST_CONTENT_IMAGE_VIEW_TYPE)
          .withAncestor(by.type(UI_TAB_SIDEBAR_COLLECTION_VIEW_TYPE)),
      ),
    ).not.toExist();
  });

  it('tabSidebar mode enables the sidebar option in the tab bar', async () => {
    await setTabBarControllerMode('tabSidebar');
    await expect(
      element(by.label('Toggle sidebar').and(by.type(UI_BUTTON_TYPE))),
    ).toBeVisible();
    await element(
      by.label('Toggle sidebar').and(by.type(UI_BUTTON_TYPE)),
    ).tap();
    await expect(
      element(by.type(UI_FLOATING_TAB_BAR_COLLECTION_VIEW_TYPE)),
    ).not.toBeVisible();
    await expect(
      element(by.type(UI_TAB_SIDEBAR_COLLECTION_VIEW_TYPE)),
    ).toExist();
    await expect(
      element(
        by
          .type(UI_LIST_CONTENT_IMAGE_VIEW_TYPE)
          .withAncestor(by.type(UI_TAB_SIDEBAR_COLLECTION_VIEW_TYPE)),
      ),
    ).toExist();
    await element(by.type(RCT_ROOT_COMPONENT_VIEW_TYPE)).atIndex(0).tap();
    await expect(
      element(by.type(UI_FLOATING_TAB_BAR_COLLECTION_VIEW_TYPE)),
    ).toBeVisible();
    await expect(
      element(by.type(UI_TAB_SIDEBAR_COLLECTION_VIEW_TYPE)),
    ).not.toExist();
    await expect(
      element(
        by
          .type(UI_LIST_CONTENT_IMAGE_VIEW_TYPE)
          .withAncestor(by.type(UI_TAB_SIDEBAR_COLLECTION_VIEW_TYPE)),
      ),
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
    await expect(element(by.type(UI_TAB_BAR_TYPE))).toBeVisible();
    await expect(element(by.label('Toggle sidebar'))).not.toExist();
  });

  it('tabBar mode the bottom tab bar visible', async () => {
    await setTabBarControllerMode('tabBar');
    await expect(element(by.type(UI_TAB_BAR_TYPE))).toBeVisible();
    await expect(element(by.label('Toggle sidebar'))).not.toExist();
  });

  it('tabSidebar mode does not show side bar on iPhone', async () => {
    await setTabBarControllerMode('tabSidebar');
    await expect(element(by.type(UI_TAB_BAR_TYPE))).toBeVisible();
    await expect(element(by.label('Toggle sidebar'))).not.toExist();
  });
});
