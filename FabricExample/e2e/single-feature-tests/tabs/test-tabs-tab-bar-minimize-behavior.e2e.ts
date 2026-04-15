import { device, element, by } from 'detox';
import { expect as jestExpect } from '@jest/globals';
import { expect } from 'detox';
import { selectSingleFeatureTestsScreen } from '../../e2e-utils';

describe('Tab Bar Minimize Behavior', () => {
    beforeAll(async () => {
        await device.reloadReactNative();
        await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-tab-bar-minimize-behavior-ios');
    });

    it('Tab Bar Minimize Behavior screen should be displayed', async () => {
        await expect(element(by.id('tab-bar-minimize-behavior-picker'))).toBeVisible();
        await expect(element(by.id('tab-bar-minimize-behavior-scrollview'))).toBeVisible();
    });

    it('Collapsed tab should not be present in hierarchy when automatic value is selected', async () => {
        await expect(element(by.label('tabBarMinimizeBehavior: automatic'))).toExist();
        await element(by.label('tab-bar-item-2-label')).tap();
        await waitFor(element(by.id('row-21'))).toBeVisible().whileElement(by.id('test-screen-scroll')).scroll(600, 'down', Number.NaN, 0.85);
        const tabBarItem2 = element(by.label('tab-bar-item-2-label'));
        await expect(tabBarItem2).not.toHaveValue('Collapsed');
        await waitFor(element(by.id('row-21'))).toBeVisible().whileElement(by.id('test-screen-scroll')).scroll(600, 'up', Number.NaN, 0.85);
        await expect(tabBarItem2).not.toHaveValue('Collapsed');
    });

    it('Collapsed tab should be present in hierarchy when automatic value is onScrollDown', async () => {
        await element(by.label('tab-bar-item-1-label')).tap();
        await expect(element(by.label('tabBarMinimizeBehavior: automatic'))).toExist();
        await element(by.id('tab-bar-minimize-behavior-picker')).tap();
        await element(by.text('onScrollDown')).tap();
        await element(by.label('tab-bar-item-2-label')).tap();
        await waitFor(element(by.id('row-21'))).toBeVisible().whileElement(by.id('test-screen-scroll')).scroll(600, 'down', Number.NaN, 0.85);
        const tabBarItem2 = element(by.label('tab-bar-item-2-label')).atIndex(1);
        await expect(tabBarItem2).toHaveValue('Collapsed');
    });

    it('Collapsed tab should not be present in hierarchy when automatic value is onScrollUp', async () => {
        await element(by.label('tab-bar-item-1-label')).atIndex(0).tap();
        await expect(element(by.id('tab-bar-minimize-behavior-picker'))).toExist();
        await element(by.text('onScrollUp')).tap();
        await element(by.label('tab-bar-item-2-label')).tap();
        await waitFor(element(by.id('row-21'))).toBeVisible().whileElement(by.id('test-screen-scroll')).scroll(600, 'down', Number.NaN, 0.85);
        await waitFor(element(by.id('row-5'))).toBeVisible().whileElement(by.id('test-screen-scroll')).scroll(500, 'up', Number.NaN, 0.85);
        const tabBarItem2 = element(by.label('tab-bar-item-2-label')).atIndex(1);;
        await expect(tabBarItem2).toHaveValue('Collapsed');
    });

    it('Collapsed tab should not be present in hierarchy when never value is selected', async () => {
        await element(by.label('tab-bar-item-1-label')).atIndex(0).tap();
        await expect(element(by.id('tab-bar-minimize-behavior-picker'))).toExist();
        await element(by.text('never')).tap();
        await element(by.label('tab-bar-item-2-label')).tap();
        await waitFor(element(by.id('row-21'))).toBeVisible().whileElement(by.id('test-screen-scroll')).scroll(600, 'down', Number.NaN, 0.85);
        const tabBarItem2 = element(by.label('tab-bar-item-2-label'));
        await expect(tabBarItem2).not.toHaveValue('Collapsed');
        await waitFor(element(by.id('row-21'))).toBeVisible().whileElement(by.id('test-screen-scroll')).scroll(600, 'up', Number.NaN, 0.85);
        await expect(tabBarItem2).not.toHaveValue('Collapsed');
    });
});
