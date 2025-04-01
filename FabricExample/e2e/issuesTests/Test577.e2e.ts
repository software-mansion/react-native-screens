import { device, expect, element, by } from 'detox';

describe('Test577', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test577 should exist', async () => {
    await waitFor(element(by.id('root-screen-tests-Test577')))
      .toBeVisible()
      .whileElement(by.id('root-screen-examples-scrollview'))
      .scroll(600, 'down', NaN, 0.85);

    await expect(element(by.id('root-screen-tests-Test577'))).toBeVisible();
    await element(by.id('root-screen-tests-Test577')).tap();
  });

  // This issue is related to iOS modal
  if (device.getPlatform() === 'ios') {
    it('does not display content underneath modal with gesture disabled when attempting to close it', async () => {
      await element(by.text('Open modal')).tap();

      // Original bug was happening after a few consecutive attempts to close the modal.
      // See this GIF: https://github.com/software-mansion/react-native-screens/issues/577#issue-666185758
      // Decided to try it a few times.
      for (let i = 0; i < 5; ++i) {
        await element(by.text('Modal')).swipe('down', 'fast');
        await expect(element(by.text('Open modal'))).not.toBeVisible();
      }
    });
  }
});
