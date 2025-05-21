import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectTestScreen } from '../e2e-utils';

// issue related to iOS native back button
describeIfiOS('Test654', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await element(by.id('root-screen-switch-rtl')).tap();
  });

  it('Test654 should exist', async () => {
    await selectTestScreen('Test654');
  });

  it('back button should be visible on Second screen', async () => {
    await element(by.id('first-button-go-to-second')).tap();
    await expect(element(by.type('_UIButtonBarButton'))).toBeVisible(100);
    await expect(element(by.id('chevron.backward'))).toBeVisible(100);
  });
});
