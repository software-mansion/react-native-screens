import { device, expect, element, by } from 'detox';
import { tapBarBackButton } from '@e2e/framework/back-button';

// Skipped on Android until software-mansion/react-freeze#44 is fixed: with two
// frozen screens (the one under the focused screen of a stack and a blurred
// tab), react-freeze on React 19 makes React re-render and commit in a loop,
// so the JS thread never goes idle and Detox times out. It shows up on slow
// (CI) emulators only.
const itUnlessAndroid = device.getPlatform() === 'android' ? it.skip : it;

describe('Bottom tabs and native stack', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should go to main screen and back', async () => {
    await expect(
      element(by.id('root-screen-example-BottomTabsAndStack')),
    ).toBeVisible();
    await element(by.id('root-screen-example-BottomTabsAndStack')).tap();

    await expect(
      element(by.id('bottom-tabs-A-more-details-button')),
    ).toBeVisible();
  });

  it('should go to details screen', async () => {
    await element(by.id('root-screen-example-BottomTabsAndStack')).tap();
    await element(by.id('bottom-tabs-A-more-details-button')).tap();
    await expect(
      element(by.id('bottom-tabs-A-more-details-button')),
    ).toHaveLabel('More details 1');
  });

  it('should go to details screen and back', async () => {
    await element(by.id('root-screen-example-BottomTabsAndStack')).tap();
    await element(by.id('bottom-tabs-A-more-details-button')).tap();
    await expect(
      element(by.id('bottom-tabs-A-more-details-button')),
    ).toHaveLabel('More details 1');
    if (device.getPlatform() === 'ios') {
      await tapBarBackButton();
    } else {
      await device.pressBack();
    }
    await expect(
      element(by.id('bottom-tabs-A-more-details-button')),
    ).toHaveLabel('More details 0');
  });

  it('should go between tabs', async () => {
    await element(by.id('root-screen-example-BottomTabsAndStack')).tap();

    await element(by.id('bottom-tabs-B-tab')).tap();
    await expect(element(by.id('bottom-tabs-B-header-right-id'))).toHaveText(
      'B',
    );

    await element(by.id('bottom-tabs-A-tab')).tap();
    await expect(element(by.id('bottom-tabs-A-header-right-id'))).toHaveText(
      'A',
    );
  });

  it('should go to first screen on double tap on a tab', async () => {
    await element(by.id('root-screen-example-BottomTabsAndStack')).tap();

    await element(by.id('bottom-tabs-A-more-details-button')).tap();
    await expect(
      element(by.id('bottom-tabs-A-more-details-button')),
    ).toHaveLabel('More details 1');

    await element(by.id('bottom-tabs-A-tab')).multiTap(2);
    await expect(
      element(by.id('bottom-tabs-A-more-details-button')),
    ).toHaveLabel('More details 0');
  });

  itUnlessAndroid('should keep stack state on tab change', async () => {
    await element(by.id('root-screen-example-BottomTabsAndStack')).tap();

    await element(by.id('bottom-tabs-A-more-details-button')).tap();
    await element(by.id('bottom-tabs-A-more-details-button')).tap();
    await expect(
      element(by.id('bottom-tabs-A-more-details-button')),
    ).toHaveLabel('More details 2');

    await element(by.id('bottom-tabs-B-tab')).tap();
    await expect(
      element(by.id('bottom-tabs-B-more-details-button')),
    ).toHaveLabel('More details 0');

    await element(by.id('bottom-tabs-A-tab')).tap();
    await expect(
      element(by.id('bottom-tabs-A-more-details-button')),
    ).toHaveLabel('More details 2');
  });
});
