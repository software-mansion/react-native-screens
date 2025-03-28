import { device, expect, element, by } from 'detox';

describe('Test432', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test432 should exist', async () => {
    await waitFor(element(by.id('root-screen-tests-Test432')))
      .toBeVisible()
      .whileElement(by.id('root-screen-examples-scrollview'))
      .scroll(600, 'down', NaN, 0.85);

    await expect(element(by.id('root-screen-tests-Test432'))).toBeVisible();
    await element(by.id('root-screen-tests-Test432')).tap();
  });

  it('headerRight element should be fully visible', async () => {
    await expect(element(by.id('home-headerRight'))).toBeVisible(100);
  });

  it('headerRight elements should toggle and stay fully visible', async () => {
    await element(by.id('home-button-go-to-details')).tap();
    await expect(element(by.id('details-headerRight-red'))).toBeVisible(100);

    await element(by.id('details-button-toggle-subviews')).tap();
    // On Android, we need to wait for some elements (e.g. at first, this square is only 25% visible)
    waitFor(element(by.id('details-headerRight-green'))).toBeVisible(100);

    await element(by.id('details-button-toggle-subviews')).tap();
    await expect(element(by.id('details-headerRight-red'))).toBeVisible(100);

    if (device.getPlatform() === 'ios') {
      await element(by.id('BackButton')).tap();
    } else {
      await device.pressBack();
    }

    await expect(element(by.id('home-headerRight'))).toBeVisible(100);
  });

  it('headerLeft and headerRight elements should toggle and stay fully visible', async () => {
    await element(by.id('home-button-go-to-info')).tap();
    await expect(element(by.id('info-headerRight-green-1'))).toBeVisible(100);

    await element(by.id('info-button-toggle-subviews')).tap();
    waitFor(element(by.id('info-headerRight-green-1'))).toBeVisible(100);
    waitFor(element(by.id('info-headerRight-green-2'))).toBeVisible(100);
    waitFor(element(by.id('info-headerLeft-red'))).toBeVisible(100);

    await element(by.id('info-button-toggle-subviews')).tap();
    waitFor(element(by.id('info-headerRight-green-1'))).toBeVisible(100);

    if (device.getPlatform() === 'ios') {
      await element(by.id('BackButton')).tap();
    } else {
      await device.pressBack();
    }

    await expect(element(by.id('home-headerRight'))).toBeVisible(100);
  });

  it('headerRight element on modal should be fully visible', async () => {
    await element(by.id('home-button-show-settings')).tap();
    await expect(element(by.id('settings-headerRight'))).toBeVisible(100);

    if (device.getPlatform() === 'ios') {
      await element(by.id('settings-text')).swipe('down', 'fast');
    } else {
      await device.pressBack();
    }
    await expect(element(by.id('home-headerRight'))).toBeVisible(100);
  });
});

// Detox currently supports orientation only on iOS
if (device.getPlatform() === 'ios') {
  describe('Test528', () => {
    beforeAll(async () => {
      await device.reloadReactNative();
    });

    it('Test528 should exist', async () => {
      await waitFor(element(by.id('root-screen-tests-Test528')))
        .toBeVisible()
        .whileElement(by.id('root-screen-examples-scrollview'))
        .scroll(600, 'down', NaN, 0.85);

      await expect(element(by.id('root-screen-tests-Test528'))).toBeVisible();
      await element(by.id('root-screen-tests-Test528')).tap();
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
      await element(by.id('BackButton')).tap();
      await expect(element(by.text('Custom Button'))).toBeVisible(100);
      await device.setOrientation('portrait');
      await expect(element(by.text('Custom Button'))).toBeVisible(100);
    });
  });
}

// This issue is related to iOS modal
if (device.getPlatform() === 'ios') {
  describe('Test577', () => {
    beforeAll(async () => {
      await device.reloadReactNative();
    });

    it('should Test577 exist', async () => {
      await waitFor(element(by.id('root-screen-tests-Test577')))
      .toBeVisible()
      .whileElement(by.id('root-screen-examples-scrollview'))
      .scroll(600, 'down', NaN, 0.85);

      await expect(element(by.id('root-screen-tests-Test577'))).toBeVisible();
      await element(by.id('root-screen-tests-Test577')).tap();
    });

    it('does not display content underneath modal when attempting to close it', async () => {
      await element(by.text('Open modal')).tap();
      for (let i = 0; i < 5; ++i) {
        await element(by.text('Modal')).swipe('down', 'fast');
        await expect(element(by.text('Open modal'))).not.toBeVisible();
      }
    });
  });
}
