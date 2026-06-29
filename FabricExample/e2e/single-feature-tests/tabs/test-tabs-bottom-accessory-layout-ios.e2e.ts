import { device, expect, element, by } from 'detox';
import { expect as jestExpect } from '@jest/globals';
import {
  describeIfiOS,
  selectSingleFeatureTestsScreen,
  forceTapByLabeliOS,
} from '../../e2e-utils';
import { IosElementAttributes } from 'detox/detox';

const bottomAccessoryElement = (testID: string) =>
  element(
    by.id(testID).withAncestor(by.type('RNSTabsBottomAccessoryComponentView')),
  ).atIndex(0);

async function expectBottomAccessoryVisible(testID: string) {
  await expect(bottomAccessoryElement(testID)).toBeVisible();
}

async function expectBottomAccessoryText(testID: string, text: string) {
  await expect(bottomAccessoryElement(testID)).toHaveText(text);
}

function expectBottomAccessoryExtended(
  bottomAccessory: IosElementAttributes,
  tabBar: IosElementAttributes,
) {
  jestExpect(tabBar.frame.y).toBeGreaterThan(
    bottomAccessory.frame.y + bottomAccessory.frame.height,
  );
}

function expectBottomAccessoryInline(
  inlineAccessory: IosElementAttributes,
  extendedAccessoryWidth: number,
  tabBar: IosElementAttributes,
) {
  jestExpect(extendedAccessoryWidth).toBeGreaterThan(
    inlineAccessory.frame.width,
  );
  jestExpect(inlineAccessory.frame.y).toBeGreaterThanOrEqual(tabBar.frame.y);
}

async function scrollScrollViewToItem(
  scrollViewId: string,
  itemId: string,
  direction: 'up' | 'down',
) {
  await waitFor(element(by.id(itemId)))
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(150, direction, NaN, 0.3);
}

describeIfiOS('Tabs bottomAccessory (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-bottom-accessory-layout-ios',
    );
  });

  it('should display the Config tab content and initial accessory on load', async () => {
    await expect(element(by.id('config-scrollview'))).toBeVisible();
    await expect(element(by.id('variant-upper-left'))).toBeVisible();
    await expect(element(by.id('variant-center'))).toBeVisible();
    await expect(element(by.id('variant-lower-right'))).toBeVisible();
    await expect(element(by.id('variant-long'))).toBeVisible();
    await expect(element(by.id('variant-rgb'))).toBeVisible();
    await expect(
      element(by.type('RNSTabsBottomAccessoryComponentView')),
    ).toBeVisible();
  });

  it('should show the Upper Left accessory variant on initial load', async () => {
    await expectBottomAccessoryVisible('accessory-upper-left');
    await expectBottomAccessoryText('accessory-upper-left', 'Upper Left');
  });

  it('should update the accessory when Center variant card is tapped', async () => {
    await element(by.id('variant-center')).tap();
    await expectBottomAccessoryVisible('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');
  });

  it('should update the accessory when Lower Right variant card is tapped', async () => {
    await element(by.id('variant-lower-right')).tap();
    await expectBottomAccessoryVisible('accessory-lower-right');
    await expectBottomAccessoryText('accessory-lower-right', 'Lower Right');
  });

  it('should update the accessory when Long variant card is tapped', async () => {
    await element(by.id('variant-long')).tap();
    await expectBottomAccessoryVisible('accessory-long');
  });

  it('should update the accessory when RGB variant card is tapped', async () => {
    await element(by.id('variant-rgb')).tap();
    await expectBottomAccessoryVisible('rgb-strip-0');
    await expectBottomAccessoryVisible('rgb-strip-1');
    await expectBottomAccessoryVisible('rgb-strip-2');
  });

  // ---------------------------------------------------------------------------
  // Accessory persistence across tab switches
  // ---------------------------------------------------------------------------

  it('should preserve the accessory when switching to the ScrollDown tab and back', async () => {
    await element(by.id('variant-center')).tap();
    await expectBottomAccessoryVisible('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');

    await forceTapByLabeliOS('scroll-down-tab-item-label');
    await expect(element(by.id('scroll-down-scrollview'))).toBeVisible();
    await expectBottomAccessoryVisible('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');

    await forceTapByLabeliOS('config-tab-item-label');
    await expect(element(by.id('config-scrollview'))).toBeVisible();
    await expectBottomAccessoryVisible('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');
  });

  // ---------------------------------------------------------------------------
  // Tab navigation: ScrollDown tab content
  // ---------------------------------------------------------------------------

  it('should display the ScrollDown tab scrollable list with extended bottom accessory', async () => {
    await forceTapByLabeliOS('scroll-down-tab-item-label');

    await expect(element(by.id('scroll-down-scrollview'))).toBeVisible();
    await expect(element(by.id('scroll-down-item-1'))).toBeVisible();

    const extendedBottomAccessory = (await element(
      by.type('RNSTabsBottomAccessoryComponentView'),
    )
      .atIndex(0)
      .getAttributes()) as IosElementAttributes;
    const extendedTabBar = (await element(
      by.type('UITabBar'),
    ).getAttributes()) as IosElementAttributes;

    await expectBottomAccessoryVisible('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');
    expectBottomAccessoryExtended(extendedBottomAccessory, extendedTabBar);
  });

  it('should display the bottom accessory inline when scrolling down on ScrollDown tab', async () => {
    const extendedBottomAccessory = (await element(
      by.type('RNSTabsBottomAccessoryComponentView'),
    )
      .atIndex(0)
      .getAttributes()) as IosElementAttributes;
    const extendedAccessoryWidth = extendedBottomAccessory.frame.width;
    const extendedTabBar = (await element(
      by.type('UITabBar'),
    ).getAttributes()) as IosElementAttributes;

    await scrollScrollViewToItem(
      'scroll-down-scrollview',
      'scroll-down-item-18',
      'down',
    );

    const inlineBottomAccessory = (await element(
      by.type('RNSTabsBottomAccessoryComponentView'),
    )
      .atIndex(0)
      .getAttributes()) as IosElementAttributes;

    await expectBottomAccessoryVisible('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');
    expectBottomAccessoryInline(
      inlineBottomAccessory,
      extendedAccessoryWidth,
      extendedTabBar,
    );
  });

  it('should display the bottom accessory above the tab bar when scrolling up on ScrollDown tab', async () => {
    await element(by.id('scroll-down-scrollview')).scrollTo('top');

    const extendedTabBar = (await element(
      by.type('UITabBar'),
    ).getAttributes()) as IosElementAttributes;

    const restoredBottomAccessory = (await element(
      by.type('RNSTabsBottomAccessoryComponentView'),
    )
      .atIndex(0)
      .getAttributes()) as IosElementAttributes;

    expectBottomAccessoryExtended(restoredBottomAccessory, extendedTabBar);
  });

  // ---------------------------------------------------------------------------
  // Tab navigation: ScrollUp tab content
  // ---------------------------------------------------------------------------

  it('should display the ScrollUp tab scrollable list', async () => {
    await forceTapByLabeliOS('scroll-up-tab-item-label');

    await expect(element(by.id('scroll-up-scrollview'))).toBeVisible();

    const extendedBottomAccessory = (await element(
      by.type('RNSTabsBottomAccessoryComponentView'),
    )
      .atIndex(0)
      .getAttributes()) as IosElementAttributes;
    const extendedTabBar = (await element(
      by.type('UITabBar'),
    ).getAttributes()) as IosElementAttributes;

    await expectBottomAccessoryVisible('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');
    expectBottomAccessoryExtended(extendedBottomAccessory, extendedTabBar);
  });

  it('should display the bottom accessory inline when scrolling up on ScrollUp tab', async () => {
    const extendedBottomAccessory = (await element(
      by.type('RNSTabsBottomAccessoryComponentView'),
    )
      .atIndex(0)
      .getAttributes()) as IosElementAttributes;
    const extendedAccessoryWidth = extendedBottomAccessory.frame.width;
    const extendedTabBar = (await element(
      by.type('UITabBar'),
    ).getAttributes()) as IosElementAttributes;

    await scrollScrollViewToItem(
      'scroll-up-scrollview',
      'scroll-up-item-13',
      'up',
    );

    const inlineBottomAccessory = (await element(
      by.type('RNSTabsBottomAccessoryComponentView'),
    )
      .atIndex(0)
      .getAttributes()) as IosElementAttributes;

    await expectBottomAccessoryVisible('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');
    expectBottomAccessoryInline(
      inlineBottomAccessory,
      extendedAccessoryWidth,
      extendedTabBar,
    );
  });

  it('should display the bottom accessory above the tab bar when scrolling down on ScrollUp tab', async () => {
    await expect(element(by.id('scroll-up-item-14'))).toBeVisible();
    await scrollScrollViewToItem(
      'scroll-up-scrollview',
      'scroll-up-item-40',
      'down',
    );

    const extendedTabBar = (await element(
      by.type('UITabBar'),
    ).getAttributes()) as IosElementAttributes;

    const restoredBottomAccessory = (await element(
      by.type('RNSTabsBottomAccessoryComponentView'),
    )
      .atIndex(0)
      .getAttributes()) as IosElementAttributes;

    expectBottomAccessoryExtended(restoredBottomAccessory, extendedTabBar);
  });
});
