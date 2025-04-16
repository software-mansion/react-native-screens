import { device, expect, element, by } from 'detox';

describe('Test640', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test640 should exist', async () => {
    await waitFor(element(by.id('root-screen-tests-Test640')))
      .toBeVisible()
      .whileElement(by.id('root-screen-examples-scrollview'))
      .scroll(600, 'down', NaN, 0.85);

    await expect(element(by.id('root-screen-tests-Test640'))).toBeVisible();
    await element(by.id('root-screen-tests-Test640')).tap();
  });

  it('scrolling down on modal should not close the modal but activate refresh', async () => {
    await element(by.id('home-button-go-to-modal')).tap();
    await element(by.text('Scroll to 4')).swipe('down', 'fast');

    if (device.getPlatform() === 'android') {
      await expect(element(by.id('modal-refresh-control'))).toBeVisible();
    } else {
      await expect(element(by.type('UIRefreshControl'))).toBeVisible();
    }

    await expect(element(by.id('home-button-go-to-modal'))).not.toBeVisible();
  });
});
