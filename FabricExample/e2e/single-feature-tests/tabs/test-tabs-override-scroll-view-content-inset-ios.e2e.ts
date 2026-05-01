import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { IosElementAttributes } from 'detox/detox';
import {
  describeIfiOS,
  forceTapByLabeliOS,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

async function getElementAttributes(
  testLabel: string,
): Promise<IosElementAttributes> {
  const attrs = await element(by.label(testLabel)).getAttributes();
  return attrs as IosElementAttributes;
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
async function getElementFrame(label: string): Promise<{
  x: number;
  y: number;
  width: number;
  height: number;
}> {
  const attrs = await element(by.label(label)).getAttributes();
  return (attrs as IosElementAttributes).frame;
}

function isAboveTabBar(
  itemFrame: { y: number; height: number },
  tabBarFrame: { y: number },
): boolean {
  return itemFrame.y + itemFrame.height < tabBarFrame.y;
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
    beforeEach(async () => {
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
      const lastItemFrame = await getElementFrame('Item 30');
      const tabFrame = await getTabBarFrame();
      jestExpect(isAboveTabBar(lastItemFrame, tabFrame)).toBe(false);
    });

    it('should hide the information text behind the inset ', async () => {
      await expect(
        element(by.id('override-inset-false-scrollview')),
      ).toBeVisible();
      await scrollToMaxTop('override-inset-false-scrollview');

      const informationFrame = await getElementFrame(
        'overrideScrollViewContentInsetAdjustmentBehavior: false',
      );
      jestExpect(informationFrame.y).toEqual(16);
    });
  });

  describe('True tab (overrideScrollViewContentInsetAdjustmentBehavior: true)', () => {
    beforeAll(async () => {
      await element(by.label('override-inset-tab-true')).tap();
    });

    it('should display the true tab scrollview with the tab bar visible', async () => {
      await expect(
        element(by.id('override-inset-true-scrollview')),
      ).toBeVisible();
      await expect(element(by.type('UITabBar'))).toBeVisible();
    });

    it('should render the last item fully above the tab bar (proper inset applied)', async () => {
      await scrollToMaxBottom('override-inset-true-scrollview');
      const lastItemFrame = await getElementFrame('Item 30');
      const tabFrame = await getTabBarFrame();
      jestExpect(isAboveTabBar(lastItemFrame, tabFrame)).toBe(true);
    });

    it('should show the header label visible (not hidden behind inset)', async () => {
      await scrollToMaxTop('override-inset-true-scrollview');
      await expect(
        element(
          by.label('overrideScrollViewContentInsetAdjustmentBehavior: true'),
        ),
      ).toBeVisible();
    });
  });
  describe('Default tab (prop omitted)', () => {
    beforeAll(async () => {
      await element(by.label('override-inset-tab-default')).tap();
    });

    it('should display the default tab scrollview with the tab bar visible', async () => {
      await expect(
        element(by.id('override-inset-default-scrollview')),
      ).toBeVisible();
      await expect(element(by.type('UITabBar'))).toBeVisible();
    });

    it('should render the last item fully above the tab bar (proper inset applied)', async () => {
      await scrollToMaxBottom('override-inset-default-scrollview');
      const lastItemFrame = await getElementFrame('Item 30');
      const tabFrame = await getTabBarFrame();
      jestExpect(isAboveTabBar(lastItemFrame, tabFrame)).toBe(true);
    });

    it('should show the header label visible (not hidden behind inset)', async () => {
      await scrollToMaxTop('override-inset-default-scrollview');
      await expect(
        element(
          by.label(
            'overrideScrollViewContentInsetAdjustmentBehavior: (not set, defaults to true)',
          ),
        ),
      ).toBeVisible();
    });
  });

  describe('Cross-tab comparison', () => {
    beforeAll(async () => {
      await forceTapByLabeliOS('override-inset-tab-default');
    });

    it('should show the information text visible (not hidden behind inset)', async () => {
      await element(by.label('override-inset-tab-true')).tap();
      await expect(
        element(by.id('override-inset-true-scrollview')),
      ).toBeVisible();
      await expect(element(by.label('Item 1'))).toBeVisible();
      await expect(
        element(
          by.label('overrideScrollViewContentInsetAdjustmentBehavior: true'),
        ),
      ).toBeVisible();

      await element(by.label('override-inset-tab-default')).tap();
      await expect(
        element(by.id('override-inset-default-scrollview')),
      ).toBeVisible();
      await expect(element(by.label('Item 1'))).toBeVisible();
      await expect(
        element(
          by.label(
            'overrideScrollViewContentInsetAdjustmentBehavior: (not set, defaults to true)',
          ),
        ),
      ).toBeVisible();
      await element(by.label('override-inset-tab-true')).tap();
      await expect(
        element(by.id('override-inset-true-scrollview')),
      ).toBeVisible();
      await expect(element(by.label('Item 1'))).toBeVisible();
      await expect(
        element(
          by.label('overrideScrollViewContentInsetAdjustmentBehavior: true'),
        ),
      ).toBeVisible();
    });

    it('should show the information text visible (not hidden behind inset)', async () => {
      await element(by.label('override-inset-tab-false')).tap();
      await expect(
        element(by.id('override-inset-false-scrollview')),
      ).toBeVisible();
      await expect(element(by.label('Item 1'))).toBeVisible();
      const informationFrame = await getElementFrame(
        'overrideScrollViewContentInsetAdjustmentBehavior: false',
      );
      jestExpect(informationFrame.y).toEqual(16);

      await element(by.label('override-inset-tab-true')).tap();
      await expect(
        element(by.id('override-inset-true-scrollview')),
      ).toBeVisible();
      await expect(element(by.label('Item 1'))).toBeVisible();
      await expect(
        element(
          by.label('overrideScrollViewContentInsetAdjustmentBehavior: true'),
        ),
      ).toBeVisible();
    });
  });
});
