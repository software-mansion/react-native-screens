import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '../../e2e-utils';

describe('Tab Bar Hidden', () => {
    beforeAll(async () => {
        await device.reloadReactNative();
        await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-tab-bar-hidden');
    });

    it('Tab Bar Hidden screen should be displayed', async () => {
        await expect(element(by.id('tab-bar-hidden-switch'))).toBeVisible();
        await expect(element(by.id('tab-bar-hidden-scrollview'))).toBeVisible();
    });

    it('Tab Bar should be visible by default after loading screen', async () => {
        await expect(element(by.label('tabBarHidden: false'))).toExist();
        // On iOS, we need to check for the whole tab bar visibility as view hierarchy shows individual tab bar items as exist and visible even when UITabBar is invisible. On Android, we can check for the individual tab bar item visibility as they are hidden together with the tab bar.
        if (device.getPlatform() === 'ios') {
            await expect(element(by.type('UITabBar'))).toBeVisible();
        } else {
            await expect(element(by.id('tab-bar-item-1-id'))).toBeVisible();
        }
    });

    it('Tab Bar should be hidden after changing tabBarHidden value to true', async () => {
        await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel('tabBarHidden: false');
        await element(by.id('tab-bar-hidden-switch')).tap();
        await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel('tabBarHidden: true');
        if (device.getPlatform() === 'ios') {
            await expect(element(by.type('UITabBar'))).not.toBeVisible();
        } else {
            await expect(element(by.id('tab-bar-item-1-id'))).not.toBeVisible();
        }
    });

    it('Tab Bar should reappear after changing tabBarHidden value to false', async () => {
        await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel('tabBarHidden: true');
        await element(by.id('tab-bar-hidden-switch')).tap();
        await expect(element(by.id('tab-bar-hidden-switch'))).toHaveLabel('tabBarHidden: false');
        if (device.getPlatform() === 'ios') {
            await expect(element(by.type('UITabBar'))).toBeVisible();
        } else {
            await expect(element(by.id('tab-bar-item-1-id'))).toBeVisible();
        }
    });
});
