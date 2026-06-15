import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';

describeIfiOS('Tab Bar Item Badge', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-item-badge');
  });

  it('should display all four tab bar items with correct badge values', async () => {
    await expect(element(by.id('tab-badge-item-1'))).toExist();
    await expect(element(by.id('tab-badge-item-2'))).toExist();
    await expect(element(by.id('tab-badge-item-3'))).toExist();
    await expect(element(by.id('tab-badge-item-4'))).toExist();

    await expect(
      element(
        by.type('_UIBarBadgeView').withAncestor(by.id('tab-badge-item-1')),
      ),
    ).toHaveText('1');
    await expect(
      element(
        by.type('_UIBarBadgeView').withAncestor(by.id('tab-badge-item-2')),
      ),
    ).toHaveText('1234567890');
    await expect(
      element(
        by.type('_UIBarBadgeView').withAncestor(by.id('tab-badge-item-3')),
      ),
    ).toHaveText('NEW!');
    await expect(
      element(
        by.type('_UIBarBadgeView').withAncestor(by.id('tab-badge-item-4')),
      ),
    ).toHaveText('⚠️');
  });
});
