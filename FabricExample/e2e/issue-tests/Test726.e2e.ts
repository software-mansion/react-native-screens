import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectIssueTestScreen } from '../e2e-utils';

// issue related to iOS
describeIfiOS('Test726', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test726 should exist', async () => {
    await selectIssueTestScreen('Test726');
  });

  it('swiping back should not cause the freeze', async () => {
    await expect(element(by.id('test-screen-button-push-me'))).toBeVisible();
    await element(by.id('test-screen-button-push-me')).tap();

    await expect(element(by.id('test-screen-2-text'))).toBeVisible();
    await element(by.id('test-screen-2-view')).swipe('right', 'slow', 0.9, 0.0);

    // Check that the app is still responsive by navigating to TestScreen2 again
    await expect(element(by.id('test-screen-button-push-me'))).toBeVisible();
    await element(by.id('test-screen-button-push-me')).tap();

    await expect(element(by.id('test-screen-2-text'))).toBeVisible();
  });
});
