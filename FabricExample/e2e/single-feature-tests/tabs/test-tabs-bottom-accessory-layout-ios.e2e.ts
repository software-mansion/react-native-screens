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
  scrollView: IosElementAttributes,
) {
  // The accessory sits above the scroll view's bottom edge by the 20pt padding
  // set on the scroll view's style in the test screen.
  const SCROLL_VIEW_BOTTOM_PADDING = 20;
  jestExpect(
    bottomAccessory.frame.y +
      bottomAccessory.frame.height +
      SCROLL_VIEW_BOTTOM_PADDING,
  ).toEqual(scrollView.frame.height);
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
  title: string;
  variantId?: string; // card to tap; omitted for the initial-load case
  accessories: { testID: string; text?: string }[];
};

const VARIANT_CASES: VariantCase[] = [
  {
    title: 'should show the Upper Left accessory variant on initial load',
    accessories: [{ testID: 'accessory-upper-left', text: 'Upper Left' }],
  },
  {
    title: 'should update the accessory when Center variant card is tapped',
    variantId: 'variant-center',
    accessories: [{ testID: 'accessory-center', text: 'Center' }],
  },
  {
    title:
      'should update the accessory when Lower Right variant card is tapped',
    variantId: 'variant-lower-right',
    accessories: [{ testID: 'accessory-lower-right', text: 'Lower Right' }],
  },
  {
    title: 'should update the accessory when Long variant card is tapped',
    variantId: 'variant-long',
    accessories: [{ testID: 'accessory-long' }],
  },
  {
    title: 'should update the accessory when RGB variant card is tapped',
    variantId: 'variant-rgb',
    accessories: [
      { testID: 'rgb-strip-0' },
      { testID: 'rgb-strip-1' },
      { testID: 'rgb-strip-2' },
    ],
  },
];

async function runVariantSwitch({ variantId, accessories }: VariantCase) {
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
 * Registers the shared variant-switch tests inside the calling describe block.
 * `titleSuffix` differentiates the iPad titles; `afterSwitch` runs any
 * platform-specific assertion once the variant is applied.
 */
function registerVariantTests(
  titleSuffix = '',
  afterSwitch?: () => Promise<void> | void,
) {
  for (const variantCase of VARIANT_CASES) {
    it(`${variantCase.title}${titleSuffix}`, async () => {
      await runVariantSwitch(variantCase);
      await afterSwitch?.();
    });
  }
}

/**
 * Registers the shared initial-load test inside the calling describe block.
 * Asserts the Config tab renders every variant card plus the initial accessory.
 */
function registerInitialLoadTest() {
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
}

describeIfiOS('Tabs bottomAccessory (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-bottom-accessory-layout-ios',
    );
  });

  registerInitialLoadTest();

  registerVariantTests();

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
  // The Config scroll view is the same across every test in this block, so read
  // its frame once and reuse it.
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

  registerInitialLoadTest();

  registerVariantTests(' and stays anchored to the bottom', async () => {
    expectBottomAccessoryAtTheBottom(
      await getBottomAccessoryAttributes(),
      configScrollView,
    );
  });
});
