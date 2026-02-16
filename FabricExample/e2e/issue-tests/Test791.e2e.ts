import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectIssueTestScreen } from '../e2e-utils';

// issue related to iOS
describeIfiOS('Test791', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test791 should exist', async () => {
    await selectIssueTestScreen('Test791');
  });

  it('the app should not crash after quickly pushing multiple card screens behind the modal', async () => {
    await element(by.id('main-button-push-modal')).tap();
    await element(by.id('push-button-push-multiple')).tap();
  });

  it('pushed screens should be visible after closing modal', async () => {
    await element(by.text('Modal')).swipe('down', 'fast');

    for (let i = 0; i < 5; ++i) {
      await expect(element(by.id('push-text'))).toBeVisible();
      await element(by.type('_UIButtonBarButton')).atIndex(0).tap();
    }

    await expect(element(by.id('main-text'))).toBeVisible();
  });
});
