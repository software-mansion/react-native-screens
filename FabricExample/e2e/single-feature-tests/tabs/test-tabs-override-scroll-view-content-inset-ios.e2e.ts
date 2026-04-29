import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { IosElementAttributes } from 'detox/detox';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';

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

function isAboveTabBar(
  itemFrame: { y: number; height: number },
  tabBarFrame: { y: number },
): boolean {
  return itemFrame.y + itemFrame.height <= tabBarFrame.y;
}

async function resetScrollToTop(scrollViewId: string) {
  await element(by.id(scrollViewId)).scroll(5000, 'up', NaN, 0.9);
}

describeIfiOS('Override Scroll View Content Inset (iOS)', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-override-scroll-view-content-inset-ios',
    );
  });

  describe('False tab (overrideScrollViewContentInsetAdjustmentBehavior: false)', () => {
    it('should display the false tab scrollview with the tab bar visible', async () => {
      await element(by.id('override-inset-false-scrollview')).scroll(
        600,
        'down',
        Number.NaN,
        0.85,
      );

      const tabFalse = await getElementAttributes('override-inset-tab-false');
      console.log(tabFalse.frame.x, tabFalse.frame.y);
      await device.tap({ x: tabFalse.frame.x, y: tabFalse.frame.y });
      await element(by.id('override-inset-false-scrollview')).scroll(
        600,
        'down',
        Number.NaN,
        0.85,
      );
      // await expect(element(by.id('override-inset-false-scrollview'))).toBeVisible();
      // await expect(element(by.type('UITabBar'))).toBeVisible();
      // const tabBarFrame = getTabBarFrame();
      // console.log(tabBarFrame)
    });

    // it('should hide the header label behind the inset (not visible)', async () => {
    //   await expect(
    //     element(by.label('overrideScrollViewContentInsetAdjustmentBehavior: false')),
    //   ).not.toBeVisible();
    // });

    // it('should render the last item overlapping or behind the tab bar (not fully above it)', async () => {
    //   await element(by.id('override-inset-false-scrollview')).scroll(
    //     5000,
    //     'down',
    //     NaN,
    //     0.1,
    //   );

    //   const lastItem = element(by.text('Item 30'));
    //   await expect(lastItem).toBeVisible();

    //   const lastItemFrame = await getFrame(lastItem);
    //   const tabBarFrame = await getTabBarFrame();

    //   jestExpect(isAboveTabBar(lastItemFrame, tabBarFrame)).toBe(false);
    // });
  });

  // describe('True tab (overrideScrollViewContentInsetAdjustmentBehavior: true)', () => {
  //   beforeEach(async () => {
  //     await element(by.id('override-inset-tab-true')).tap();
  //   });

  //   it('should display the true tab scrollview with the tab bar visible', async () => {
  //     await expect(element(by.id('override-inset-true-scrollview'))).toBeVisible();
  //     await expect(element(by.type('UITabBar'))).toBeVisible();
  //   });

  //   it('should show the header label visible (not hidden behind inset)', async () => {
  //     await expect(
  //       element(by.label('overrideScrollViewContentInsetAdjustmentBehavior: true')),
  //     ).toBeVisible();
  //   });

  //   it('should render the last item fully above the tab bar (proper inset applied)', async () => {
  //     await element(by.id('override-inset-true-scrollview')).scroll(
  //       5000,
  //       'down',
  //       NaN,
  //       0.1,
  //     );

  //     const lastItem = element(by.text('Item 30'));
  //     await expect(lastItem).toBeVisible();

  //     const lastItemFrame = await getFrame(lastItem);
  //     const tabBarFrame = await getTabBarFrame();

  //     jestExpect(isAboveTabBar(lastItemFrame, tabBarFrame)).toBe(true);
  //   });
  // });
});
