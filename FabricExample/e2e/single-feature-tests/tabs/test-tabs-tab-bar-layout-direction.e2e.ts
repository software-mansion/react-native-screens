import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '../../e2e-utils';
import { IosElementAttributes } from 'detox/detox';

describe('Tab Bar Layout Direction', () => {
    beforeAll(async () => {
        await device.reloadReactNative();
        await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-tab-bar-layout-direction');
    });

    it('Tab Bar Layout Direction screen should be displayed', async () => {
        await expect(element(by.id('tab-bar-layout-direction-picker'))).toBeVisible();
        await expect(element(by.id('tab-bar-layout-direction-scrollview'))).toBeVisible();
    });

    it('Tab Bar Item Tab2 should be displayed as first when layout direction is rtl', async () => {
        await expect(element(by.id('tab-bar-layout-direction-picker'))).toBeVisible();
        await (element(by.id('tab-bar-layout-direction-picker'))).tap();
        await element(by.text('rtl')).tap();
        await (element(by.id('tab-bar-layout-direction-picker'))).tap();
        const tab1attr = await element(by.label('tab-bar-item-1-label')).getAttributes() as IosElementAttributes;
        const tab2attr = await element(by.label('tab-bar-item-2-label')).getAttributes() as IosElementAttributes;
        console.log('tab1attr: ', tab1attr.frame.x);
        console.log('tab2attr: ', tab2attr.frame.x);
        jestExpect(tab1attr.frame.x).toBeGreaterThan(tab2attr.frame.x);
    });

    it('Tab Bar Item Config should be displayed as first when layout direction is ltr', async () => {
        await expect(element(by.id('tab-bar-layout-direction-picker'))).toBeVisible();
        await (element(by.id('tab-bar-layout-direction-picker'))).tap();
        await element(by.text('ltr')).tap();
        await (element(by.id('tab-bar-layout-direction-picker'))).tap();
        const tab1attr = await element(by.label('tab-bar-item-1-label')).getAttributes() as IosElementAttributes;
        const tab2attr = await element(by.label('tab-bar-item-2-label')).getAttributes() as IosElementAttributes;
        console.log('tab1attr: ', tab1attr.frame.x);
        console.log('tab2attr: ', tab2attr.frame.x);
        jestExpect(tab2attr.frame.x).toBeGreaterThan(tab1attr.frame.x);
    });
});
