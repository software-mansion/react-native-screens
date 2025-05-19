import { device, expect, element, by } from 'detox';
import { describeIfiOS } from '../e2e-utils';

// issue related to iOS
describeIfiOS('Test726', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test726 should exist', async () => {
    await waitFor(element(by.id('root-screen-tests-Test726')))
      .toBeVisible()
      .whileElement(by.id('root-screen-examples-scrollview'))
      .scroll(600, 'down', NaN, 0.85);

    await expect(element(by.id('root-screen-tests-Test726'))).toBeVisible();
    await element(by.id('root-screen-tests-Test726')).tap();
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
