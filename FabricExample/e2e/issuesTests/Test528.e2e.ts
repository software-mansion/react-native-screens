import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectTestScreen } from '../e2e-utils';
import { tapBarBackButton } from '../component-objects/back-button';

// Detox currently supports orientation only on iOS
describeIfiOS('Test528', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test528 should exist', async () => {
    await selectTestScreen('Test528');
  });

  it('headerRight button should be visible after orientation change', async () => {
    await expect(element(by.text('Custom Button'))).toBeVisible(100);
    await device.setOrientation('landscape');
    await expect(element(by.text('Custom Button'))).toBeVisible(100);
    await device.setOrientation('portrait');
    await expect(element(by.text('Custom Button'))).toBeVisible(100);
  });

  it('headerRight button should be visible after coming back from horizontal screen', async () => {
    await element(by.text('Go to Screen 2')).tap();
    await device.setOrientation('landscape');

    await tapBarBackButton();
    await expect(element(by.text('Custom Button'))).toBeVisible(100);
    await device.setOrientation('portrait');
    await expect(element(by.text('Custom Button'))).toBeVisible(100);
  });
});
