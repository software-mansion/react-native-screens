import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '../../e2e-utils';

describe('Tab Bar Hidden', () => {
    beforeAll(async () => {
        await device.reloadReactNative();
    });

    it('Tab Bar Hidden should exist', async () => {
        await selectSingleFeatureTestsScreen('test-tabs-tab-bar-hidden');
    });

    it('config screen should be displayed', async () => {
        await expect(element(by.id('tab-bar-hidden-config-screen'))).toBeVisible(100);
    });
});
