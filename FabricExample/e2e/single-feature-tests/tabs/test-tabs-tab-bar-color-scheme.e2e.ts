import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '../../e2e-utils';

describe('Tab Bar Color Scheme', () => {
    beforeAll(async () => {
        await device.reloadReactNative();
        await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-tab-bar-color-scheme');
    });

    it('Tab Bar Color Scheme screen should be displayed', async () => {
        
        await expect(element(by.id('tab-bar-color-scheme-picker'))).toBeVisible();
        await expect(element(by.id('tab-bar-color-scheme-scrollview'))).toBeVisible();
    });
});
