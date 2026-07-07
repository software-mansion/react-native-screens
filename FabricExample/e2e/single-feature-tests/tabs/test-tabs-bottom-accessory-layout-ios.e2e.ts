import { device, expect, element, by } from 'detox';
import { expect as jestExpect } from '@jest/globals';
import {
  describeIfiOS,
  selectSingleFeatureTestsScreen,
  forceTapByLabeliOS,
  describeIfiPad,
  getElementAttributes,
} from '../../e2e-utils';
import { IosElementAttributes } from 'detox/detox';

const bottomAccessoryElement = (testID: string) =>
  element(
    by.id(testID).withAncestor(by.type('RNSTabsBottomAccessoryComponentView')),
  ).atIndex(0);

const getBottomAccessoryAttributes = () =>
  getElementAttributes({
    by: 'type',
    value: 'RNSTabsBottomAccessoryComponentView',
    index: 0,
  }) as Promise<IosElementAttributes>;

const getExtendedTabBarAttributes = async () =>
  getElementAttributes({
    by: 'type',
    value: 'UITabBar',
    index: 0,
  }) as Promise<IosElementAttributes>;

async function expectBottomAccessoryExist(testID: string) {
  await expect(bottomAccessoryElement(testID)).toExist();
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

function expectBottomAccessoryAtTheBottom(
  bottomAccessory: IosElementAttributes,
  windowSpanningElement: IosElementAttributes,
) {
  // On iPad there is no bottom tab bar; the bottom accessory floats in the
  // window's bottom band. iOS reserves that band by inflating the scroll
  // view's bottom safe-area inset (so scrollable content isn't obscured by the
  // accessory), while the accessory itself sits just above the window's
  // physical bottom edge. The exact floating gap is a system value that can
  // change across devices / OS versions, so instead of hardcoding it we assert
  // the accessory's bottom edge lands inside that reserved band: at or above
  // the window bottom, and no higher than the safe-area line.
  const windowBottom =
    windowSpanningElement.frame.y + windowSpanningElement.frame.height;
  const safeAreaLine =
    windowBottom - windowSpanningElement.safeAreaInsets.bottom;
  const bottomAccessoryBottom =
    bottomAccessory.frame.y + bottomAccessory.frame.height;

  jestExpect(bottomAccessoryBottom).toBeLessThanOrEqual(windowBottom);
  jestExpect(bottomAccessoryBottom).toBeGreaterThanOrEqual(safeAreaLine);
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

type VariantCase = {
  variantId?: string; // card to tap; omitted for the initial-load variant
  accessories: { testID: string; text?: string }[];
};

const VARIANTS = {
  upperLeft: {
    accessories: [{ testID: 'accessory-upper-left', text: 'Upper Left' }],
  },
  center: {
    variantId: 'variant-center',
    accessories: [{ testID: 'accessory-center', text: 'Center' }],
  },
  lowerRight: {
    variantId: 'variant-lower-right',
    accessories: [{ testID: 'accessory-lower-right', text: 'Lower Right' }],
  },
  long: {
    variantId: 'variant-long',
    accessories: [{ testID: 'accessory-long' }],
  },
  rgb: {
    variantId: 'variant-rgb',
    accessories: [
      { testID: 'rgb-strip-0' },
      { testID: 'rgb-strip-1' },
      { testID: 'rgb-strip-2' },
    ],
  },
} satisfies Record<string, VariantCase>;

/**
 * Shared body of a variant test: taps the variant card (when present) and
 * asserts its accessory(ies) are shown. Kept behind a helper so each `it(...)`
 * remains a one-liner while its name stays declared inline at the call site.
 */
async function switchToVariantAndVerifyAccessory({
  variantId,
  accessories,
}: VariantCase) {
  if (variantId) {
    await element(by.id(variantId)).tap();
  }
  for (const { testID, text } of accessories) {
    await expectBottomAccessoryExist(testID);
    if (text) {
      await expectBottomAccessoryText(testID, text);
    }
  }
}

/**
 * Shared body of the initial-load test: the Config tab renders every variant
 * card plus the initial accessory.
 */
async function verifyConfigTabInitialContent() {
  await expect(element(by.id('config-scrollview'))).toBeVisible();
  await expect(element(by.id('variant-upper-left'))).toBeVisible();
  await expect(element(by.id('variant-center'))).toBeVisible();
  await expect(element(by.id('variant-lower-right'))).toBeVisible();
  await expect(element(by.id('variant-long'))).toBeVisible();
  await expect(element(by.id('variant-rgb'))).toBeVisible();
  await expect(
    element(by.type('RNSTabsBottomAccessoryComponentView')),
  ).toBeVisible();
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
    await verifyConfigTabInitialContent();
  });

  it('should show the Upper Left accessory variant on initial load', async () => {
    await switchToVariantAndVerifyAccessory(VARIANTS.upperLeft);
  });

  it('should update the accessory when Center variant card is tapped', async () => {
    await switchToVariantAndVerifyAccessory(VARIANTS.center);
  });

  it('should update the accessory when Lower Right variant card is tapped', async () => {
    await switchToVariantAndVerifyAccessory(VARIANTS.lowerRight);
  });

  it('should update the accessory when Long variant card is tapped', async () => {
    await switchToVariantAndVerifyAccessory(VARIANTS.long);
  });

  it('should update the accessory when RGB variant card is tapped', async () => {
    await switchToVariantAndVerifyAccessory(VARIANTS.rgb);
  });

  // ---------------------------------------------------------------------------
  // Accessory persistence across tab switches
  // ---------------------------------------------------------------------------

  it('should preserve the accessory when switching to the ScrollDown tab and back', async () => {
    await element(by.id('variant-center')).tap();
    await expectBottomAccessoryExist('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');

    await forceTapByLabeliOS('scroll-down-tab-item-label');
    await expect(element(by.id('scroll-down-scrollview'))).toBeVisible();
    await expectBottomAccessoryExist('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');

    await forceTapByLabeliOS('config-tab-item-label');
    await expect(element(by.id('config-scrollview'))).toBeVisible();
    await expectBottomAccessoryExist('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');
  });

  // ---------------------------------------------------------------------------
  // Tab navigation: ScrollDown tab content
  // ---------------------------------------------------------------------------

  it('should display the ScrollDown tab scrollable list with extended bottom accessory', async () => {
    await forceTapByLabeliOS('scroll-down-tab-item-label');

    await expect(element(by.id('scroll-down-scrollview'))).toBeVisible();
    await expect(element(by.id('scroll-down-item-1'))).toBeVisible();

    await expectBottomAccessoryExist('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');
    expectBottomAccessoryExtended(
      await getBottomAccessoryAttributes(),
      await getExtendedTabBarAttributes(),
    );
  });

  it('should display the bottom accessory inline when scrolling down on ScrollDown tab', async () => {
    const extendedBottomAccessory = await getBottomAccessoryAttributes();
    const extendedAccessoryWidth = extendedBottomAccessory.frame.width;

    await scrollScrollViewToItem(
      'scroll-down-scrollview',
      'scroll-down-item-18',
      'down',
    );

    await expectBottomAccessoryExist('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');
    expectBottomAccessoryInline(
      await getBottomAccessoryAttributes(),
      extendedAccessoryWidth,
      await getExtendedTabBarAttributes(),
    );
  });

  it('should display the bottom accessory above the tab bar when scrolling up on ScrollDown tab', async () => {
    await element(by.id('scroll-down-scrollview')).scrollTo('top');

    expectBottomAccessoryExtended(
      await getBottomAccessoryAttributes(),
      await getExtendedTabBarAttributes(),
    );
  });

  // ---------------------------------------------------------------------------
  // Tab navigation: ScrollUp tab content
  // ---------------------------------------------------------------------------

  it('should display the ScrollUp tab scrollable list', async () => {
    await forceTapByLabeliOS('scroll-up-tab-item-label');

    await expect(element(by.id('scroll-up-scrollview'))).toBeVisible();

    await expectBottomAccessoryExist('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');
    expectBottomAccessoryExtended(
      await getBottomAccessoryAttributes(),
      await getExtendedTabBarAttributes(),
    );
  });

  it('should display the bottom accessory inline when scrolling up on ScrollUp tab', async () => {
    const extendedBottomAccessory = await getBottomAccessoryAttributes();
    const extendedAccessoryWidth = extendedBottomAccessory.frame.width;

    await scrollScrollViewToItem(
      'scroll-up-scrollview',
      'scroll-up-item-13',
      'up',
    );

    await expectBottomAccessoryExist('accessory-center');
    await expectBottomAccessoryText('accessory-center', 'Center');
    expectBottomAccessoryInline(
      await getBottomAccessoryAttributes(),
      extendedAccessoryWidth,
      await getExtendedTabBarAttributes(),
    );
  });

  it('should display the bottom accessory above the tab bar when scrolling down on ScrollUp tab', async () => {
    await expect(element(by.id('scroll-up-item-14'))).toBeVisible();
    await scrollScrollViewToItem(
      'scroll-up-scrollview',
      'scroll-up-item-40',
      'down',
    );

    expectBottomAccessoryExtended(
      await getBottomAccessoryAttributes(),
      await getExtendedTabBarAttributes(),
    );
  });
});

describeIfiPad('@ipad Tabs bottomAccessory (iPad)', () => {
  // The Config scroll view spans the full window height and is the same across
  // every test in this block, so read its frame + safe-area insets once and
  // reuse it as the window/safe-area reference for the bottom-anchor assertion.
  let configScrollView: IosElementAttributes;

  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-bottom-accessory-layout-ios',
    );
    await expect(element(by.id('config-scrollview'))).toBeVisible();
    configScrollView = (await getElementAttributes({
      by: 'id',
      value: 'config-scrollview',
      index: 0,
    })) as IosElementAttributes;
  });

  it('should display the Config tab content and initial accessory on load', async () => {
    await verifyConfigTabInitialContent();
  });

  it('should show the Upper Left accessory variant on initial load and stay anchored to the bottom', async () => {
    await switchToVariantAndVerifyAccessory(VARIANTS.upperLeft);
    expectBottomAccessoryAtTheBottom(
      await getBottomAccessoryAttributes(),
      configScrollView,
    );
  });

  it('should update the accessory when Center variant card is tapped and stay anchored to the bottom', async () => {
    await switchToVariantAndVerifyAccessory(VARIANTS.center);
    expectBottomAccessoryAtTheBottom(
      await getBottomAccessoryAttributes(),
      configScrollView,
    );
  });

  it('should update the accessory when Lower Right variant card is tapped and stay anchored to the bottom', async () => {
    await switchToVariantAndVerifyAccessory(VARIANTS.lowerRight);
    expectBottomAccessoryAtTheBottom(
      await getBottomAccessoryAttributes(),
      configScrollView,
    );
  });

  it('should update the accessory when Long variant card is tapped and stay anchored to the bottom', async () => {
    await switchToVariantAndVerifyAccessory(VARIANTS.long);
    expectBottomAccessoryAtTheBottom(
      await getBottomAccessoryAttributes(),
      configScrollView,
    );
  });

  it('should update the accessory when RGB variant card is tapped and stay anchored to the bottom', async () => {
    await switchToVariantAndVerifyAccessory(VARIANTS.rgb);
    expectBottomAccessoryAtTheBottom(
      await getBottomAccessoryAttributes(),
      configScrollView,
    );
  });
});
