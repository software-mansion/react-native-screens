import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { IosElementAttributes } from 'detox/detox';
import {
  describeIfiOS,
  forceTapByLabeliOS,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

async function getScrollViewSafeAreaInsetsTop(testID: string): Promise<{
  top: number;
}> {
  const attrs = (await element(
    by.id(testID),
  ).getAttributes()) as IosElementAttributes;
  return { top: attrs.safeAreaInsets.top };
}

function isAboveSaveAreaInset(
  itemFrame: { y: number; height: number },
  scrollViewSAVInsetTop: number,
): boolean {
  return itemFrame.y + itemFrame.height <= scrollViewSAVInsetTop;
}

async function getTabBarFrame(): Promise<{
  x: number;
  y: number;
  width: number;
  height: number;
}> {
  const attrs = await element(by.type('UITabBar')).getAttributes();
  return (attrs as IosElementAttributes).frame;
}

async function getElementFrame(testID: string): Promise<{
  x: number;
  y: number;
  width: number;
  height: number;
}> {
  const attrs = await element(by.id(testID)).getAttributes();

  if ('elements' in attrs) {
    throw new Error(
      `Multiple elements (${attrs.elements.length}) found for label: "${testID}". `,
    );
  }
  return (attrs as IosElementAttributes).frame;
}

function isAboveTabBar(
  itemFrame: { y: number; height: number },
  tabBarFrame: { y: number },
): boolean {
  return itemFrame.y + itemFrame.height <= tabBarFrame.y;
}

async function assertLastItemAboveTabBar(tabPrefix: string, expected: boolean) {
  const lastItemFrame = await getElementFrame(`${tabPrefix}-item-30`);
  const tabFrame = await getTabBarFrame();
  jestExpect(isAboveTabBar(lastItemFrame, tabFrame)).toBe(expected);
}

async function assertHeaderBehindStatusBar(
  tabPrefix: string,
  expected: boolean,
) {
  const informationFrame = await getElementFrame(`${tabPrefix}-header`);
  const scrollViewSAVInsetTop = await getScrollViewSafeAreaInsetsTop(
    `${tabPrefix}-scrollview`,
  );
  jestExpect(
    isAboveSaveAreaInset(informationFrame, scrollViewSAVInsetTop.top),
  ).toBe(expected);
}

async function scrollToMaxBottom(scrollViewId: string) {
  await element(by.id(scrollViewId)).scrollTo('bottom', NaN, 0.5);
}
async function scrollToMaxTop(scrollViewId: string) {
  await element(by.id(scrollViewId)).scrollTo('top', NaN, 0.5);
}

describeIfiOS('Override Scroll View Content Inset (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-override-scroll-view-content-inset-ios',
    );
  });

  describe('False tab (overrideScrollViewContentInsetAdjustmentBehavior: false)', () => {
    beforeAll(async () => {
      await forceTapByLabeliOS('override-inset-tab-false');
    });

    it('should display the false tab scrollview with the tab bar visible', async () => {
      await expect(
        element(by.id('override-inset-false-scrollview')),
      ).toBeVisible();
      await expect(element(by.type('UITabBar'))).toBeVisible();
    });

    it('should render the last item overlapping or behind the tab bar (not fully above it)', async () => {
      await scrollToMaxBottom('override-inset-false-scrollview');
      await assertLastItemAboveTabBar('override-inset-false', false);
    });

    it('should render the information text clipped behind the status bar ', async () => {
      await scrollToMaxTop('override-inset-false-scrollview');
      await assertHeaderBehindStatusBar('override-inset-false', true);
    });
  });

  describe('True tab (overrideScrollViewContentInsetAdjustmentBehavior: true)', () => {
    beforeAll(async () => {
      await forceTapByLabeliOS('override-inset-tab-true');
    });

    it('should display the true tab scrollview with the tab bar visible', async () => {
      await expect(
        element(by.id('override-inset-true-scrollview')),
      ).toBeVisible();
      await expect(element(by.type('UITabBar'))).toBeVisible();
    });

    it('should render the last item fully above the tab bar (proper inset applied)', async () => {
      await scrollToMaxBottom('override-inset-true-scrollview');
      await assertLastItemAboveTabBar('override-inset-true', true);
    });

    it('should show the information text visible (not hidden behind inset)', async () => {
      await scrollToMaxTop('override-inset-true-scrollview');
      await assertHeaderBehindStatusBar('override-inset-true', false);
    });
  });
  describe('Default tab (prop omitted)', () => {
    beforeAll(async () => {
      await forceTapByLabeliOS('override-inset-tab-default');
    });

    it('should display the default tab scrollview with the tab bar visible', async () => {
      await expect(
        element(by.id('override-inset-default-scrollview')),
      ).toBeVisible();
      await expect(element(by.type('UITabBar'))).toBeVisible();
    });

    it('should render the last item fully above the tab bar (proper inset applied)', async () => {
      await scrollToMaxBottom('override-inset-default-scrollview');
      await assertLastItemAboveTabBar('override-inset-default', true);
    });

    it('should show the header label visible (not hidden behind inset)', async () => {
      await scrollToMaxTop('override-inset-default-scrollview');
      await assertHeaderBehindStatusBar('override-inset-default', false);
    });
  });

  describe('Cross-tab comparison', () => {
    beforeAll(async () => {
      await forceTapByLabeliOS('override-inset-tab-default');
    });

    it('should show the information text visible between True and Default tabs', async () => {
      await element(by.label('override-inset-tab-true')).tap();
      await expect(element(by.id('override-inset-true-item-1'))).toBeVisible();
      await assertHeaderBehindStatusBar('override-inset-true', false);

      await element(by.label('override-inset-tab-default')).tap();
      await expect(
        element(by.id('override-inset-default-item-1')),
      ).toBeVisible();
      await assertHeaderBehindStatusBar('override-inset-default', false);

      await element(by.label('override-inset-tab-true')).tap();
      await assertHeaderBehindStatusBar('override-inset-true', false);
    });

    it('should render the information text correctly between False and True tabs', async () => {
      await element(by.label('override-inset-tab-false')).tap();
      await expect(element(by.id('override-inset-false-item-1'))).toBeVisible();
      await assertHeaderBehindStatusBar('override-inset-false', true);

      await element(by.label('override-inset-tab-true')).tap();
      await expect(element(by.id('override-inset-true-item-1'))).toBeVisible();
      await assertHeaderBehindStatusBar('override-inset-true', false);
    });
  });
});
