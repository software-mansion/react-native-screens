import { device, expect, element, by } from 'detox';
import { describeIfiOS } from '../e2e-utils';

// issue related to iOS native back button
describeIfiOS('Test654', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await element(by.id('root-screen-switch-rtl')).tap();
  });

  it('Test654 should exist', async () => {
    await waitFor(element(by.id('root-screen-tests-Test654')))
      .toBeVisible()
      .whileElement(by.id('root-screen-examples-scrollview'))
      .scroll(600, 'down', NaN, 0.85);

    await expect(element(by.id('root-screen-tests-Test654'))).toBeVisible();
    await element(by.id('root-screen-tests-Test654')).tap();
  });

  it('back button should be visible on Second screen', async () => {
    await element(by.id('first-button-go-to-second')).tap();
    await expect(element(by.type('_UIButtonBarButton'))).toBeVisible(100);
    await expect(element(by.id('chevron.backward'))).toBeVisible(100);
  });
});
