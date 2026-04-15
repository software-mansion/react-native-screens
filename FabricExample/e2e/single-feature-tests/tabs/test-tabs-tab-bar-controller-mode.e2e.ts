import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '../../e2e-utils';

describe('Tab Bar Controller mode', () => {
    beforeAll(async () => {
        await device.reloadReactNative();
        await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-tab-bar-controller-mode-ios');
    });

    // it('Tab Bar Controller Mode screen should be displayed', async () => {
    //     await expect(element(by.id('tab-bar-controller-mode-picker'))).toBeVisible();
    //     await expect(element(by.id('tab-bar-controller-mode-scrollview'))).toBeVisible();
    // });

    // it('Side Tab Bar should be hidden', async () => {
    //     await expect(element(by.label('tabBarControllerMode: automatic'))).toExist();
    //     await expect(element(by.label('Toggle sidebar'))).not.toBeVisible();
    //     await expect(element(by.type('_UIFloatingTabBar'))).toBeVisible();
    //     await expect(element(by.type('_UIFloatingTabBarItemCell'))).toBeVisible();
    // });

    it('Side Tab Bar should be visible', async () => {
        await expect(element(by.label('tabBarControllerMode: automatic'))).toExist();
        await element(by.id('tab-bar-controller-mode-picker')).tap();
        await element(by.text('tabSidebar')).tap();
        await element(by.id('tab-bar-controller-mode-picker')).tap();
        await expect(element(by.id('ToggleSideBar'))).toExist();
        await expect(element(by.type('_UIFloatingTabBar'))).toBeVisible();
    });
});
