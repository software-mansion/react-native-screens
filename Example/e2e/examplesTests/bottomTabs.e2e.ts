import { device, expect, element, by } from 'detox';

describe('Bottom tabs and native stack', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should go to main screen and back', async () => {
    await expect(
      element(by.id('root-screen-example-BottomTabsAndStack'))
    ).toBeVisible();
    await element(by.id('root-screen-example-BottomTabsAndStack')).tap();

    await expect(
      element(by.id('bottom-tabs-more-details-button'))
    ).toBeVisible();
  });

  it('should go to details screen', async () => {
    await element(by.id('root-screen-example-BottomTabsAndStack')).tap();
    await element(by.id('bottom-tabs-more-details-button')).tap();
    await expect(element(by.id('bottom-tabs-more-details-button'))).toHaveLabel(
      'More details 1'
    );
  });

  it('should go to details screen and back', async () => {
    await element(by.id('root-screen-example-BottomTabsAndStack')).tap();
    await element(by.id('bottom-tabs-more-details-button')).tap();
    await expect(element(by.id('bottom-tabs-more-details-button'))).toHaveLabel(
      'More details 1'
    );
    if (device.getPlatform() === 'ios') {
      await element(by.type('_UIButtonBarButton')).tap();
    } else {
      await device.pressBack();
    }
    await expect(element(by.id('bottom-tabs-more-details-button'))).toHaveLabel(
      'More details 0'
    );
  });

  it('should go between tabs', async () => {
    await element(by.id('root-screen-example-BottomTabsAndStack')).tap();

    await element(by.id('bottom-tabs-B-tab')).tap();
    await expect(element(by.id('bottom-tabs-header-right-id'))).toHaveText('B');

    await element(by.id('bottom-tabs-A-tab')).tap();
    await expect(element(by.id('bottom-tabs-header-right-id'))).toHaveText('A');
  });

  it('should go to first screen on double tap on a tab', async () => {
    await element(by.id('root-screen-example-BottomTabsAndStack')).tap();

    await element(by.id('bottom-tabs-more-details-button')).tap();
    await expect(element(by.id('bottom-tabs-more-details-button'))).toHaveLabel(
      'More details 1'
    );

    await element(by.id('bottom-tabs-A-tab')).multiTap(2);
    await expect(element(by.id('bottom-tabs-more-details-button'))).toHaveLabel(
      'More details 0'
    );
  });

  it('should keep stack state on tab change', async () => {
    await element(by.id('root-screen-example-BottomTabsAndStack')).tap();

    await element(by.id('bottom-tabs-more-details-button')).tap();
    await element(by.id('bottom-tabs-more-details-button')).tap();
    await expect(element(by.id('bottom-tabs-more-details-button'))).toHaveLabel(
      'More details 2'
    );

    await element(by.id('bottom-tabs-B-tab')).tap();
    await expect(element(by.id('bottom-tabs-more-details-button'))).toHaveLabel(
      'More details 0'
    );
    await element(by.id('bottom-tabs-A-tab')).tap();

    await expect(element(by.id('bottom-tabs-more-details-button'))).toHaveLabel(
      'More details 2'
    );
  });
});
