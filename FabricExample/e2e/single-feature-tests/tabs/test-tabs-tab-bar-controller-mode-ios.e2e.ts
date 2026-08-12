import { device, expect, element, by } from 'detox';
import { describeIfiOS, describeIfiPad } from '../../e2e-utils';
import { selectSingleFeatureTestsScreen } from '../../elements/test-screen-navigation';
import { selectPickerOption } from '../../elements/settings-controls';
import {
  CLASS_NAME_UI_FLOATING_TAB_BAR_COLLECTION_VIEW,
  CLASS_NAME_UI_TAB_SIDEBAR_COLLECTION_VIEW,
  CLASS_NAME_UI_BUTTON,
  CLASS_NAME_RCT_ROOT_COMPONENT_VIEW,
  CLASS_NAME_UI_TAB_BAR,
  CLASS_NAME_UI_LIST_CONTENT_IMAGE_VIEW,
} from '../../native-class-names';

const PICKER_ID = 'tab-bar-controller-mode-picker';

type TabBarControllerMode = 'automatic' | 'tabBar' | 'tabSidebar';

async function setTabBarControllerMode(mode: TabBarControllerMode) {
  await selectPickerOption({
    pickerId: PICKER_ID,
    label: 'tabBarControllerMode',
    option: mode,
  });
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
      element(by.type(CLASS_NAME_UI_FLOATING_TAB_BAR_COLLECTION_VIEW)),
    ).toBeVisible();
  });

  it('tabBar mode shows the floating tab bar', async () => {
    await setTabBarControllerMode('tabBar');
    await expect(
      element(by.type(CLASS_NAME_UI_FLOATING_TAB_BAR_COLLECTION_VIEW)),
    ).toBeVisible();
    await expect(element(by.label('Toggle sidebar'))).not.toExist();
    await expect(
      element(
        by
          .type(CLASS_NAME_UI_LIST_CONTENT_IMAGE_VIEW)
          .withAncestor(by.type(CLASS_NAME_UI_TAB_SIDEBAR_COLLECTION_VIEW)),
      ),
    ).not.toExist();
  });

  it('tabSidebar mode enables the sidebar option in the tab bar', async () => {
    await setTabBarControllerMode('tabSidebar');
    await expect(
      element(by.label('Toggle sidebar').and(by.type(CLASS_NAME_UI_BUTTON))),
    ).toBeVisible();
    await element(
      by.label('Toggle sidebar').and(by.type(CLASS_NAME_UI_BUTTON)),
    ).tap();
    await expect(
      element(by.type(CLASS_NAME_UI_FLOATING_TAB_BAR_COLLECTION_VIEW)),
    ).not.toBeVisible();
    await expect(
      element(by.type(CLASS_NAME_UI_TAB_SIDEBAR_COLLECTION_VIEW)),
    ).toExist();
    await expect(
      element(
        by
          .type(CLASS_NAME_UI_LIST_CONTENT_IMAGE_VIEW)
          .withAncestor(by.type(CLASS_NAME_UI_TAB_SIDEBAR_COLLECTION_VIEW)),
      ),
    ).toExist();
    await element(by.type(CLASS_NAME_RCT_ROOT_COMPONENT_VIEW)).atIndex(0).tap();
    await expect(
      element(by.type(CLASS_NAME_UI_FLOATING_TAB_BAR_COLLECTION_VIEW)),
    ).toBeVisible();
    await expect(
      element(by.type(CLASS_NAME_UI_TAB_SIDEBAR_COLLECTION_VIEW)),
    ).not.toExist();
    await expect(
      element(
        by
          .type(CLASS_NAME_UI_LIST_CONTENT_IMAGE_VIEW)
          .withAncestor(by.type(CLASS_NAME_UI_TAB_SIDEBAR_COLLECTION_VIEW)),
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
    await expect(element(by.type(CLASS_NAME_UI_TAB_BAR))).toBeVisible();
    await expect(element(by.label('Toggle sidebar'))).not.toExist();
  });

  it('tabBar mode the bottom tab bar visible', async () => {
    await setTabBarControllerMode('tabBar');
    await expect(element(by.type(CLASS_NAME_UI_TAB_BAR))).toBeVisible();
    await expect(element(by.label('Toggle sidebar'))).not.toExist();
  });

  it('tabSidebar mode does not show side bar on iPhone', async () => {
    await setTabBarControllerMode('tabSidebar');
    await expect(element(by.type(CLASS_NAME_UI_TAB_BAR))).toBeVisible();
    await expect(element(by.label('Toggle sidebar'))).not.toExist();
  });
});
