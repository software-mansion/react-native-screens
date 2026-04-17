import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';
import { AndroidElementAttributes, IosElementAttributes } from 'detox/detox';

type ElementAttributes = IosElementAttributes | AndroidElementAttributes;

async function getElementAttributes(
  testLabel: string,
): Promise<ElementAttributes> {
  const attrs = await element(by.label(testLabel)).getAttributes();
  return attrs as ElementAttributes;
}

describe('Tab Bar Layout Direction - system settings: LTR', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-tab-bar-layout-direction',
    );
  });

  it('Tab Bar Layout Direction screen should be displayed with default options. Tab bar follow lts order: Tab1 first from left.', async () => {
    await expect(
      element(by.id('tab-bar-layout-direction-picker')),
    ).toBeVisible();
    await expect(
      element(by.id('tab-bar-layout-direction-scrollview')),
    ).toBeVisible();
    await expect(element(by.id('react-force-rtl-picker'))).toHaveLabel(
      'forceRTL: false',
    );
    await expect(element(by.id('react-allow-rtl-picker'))).toHaveLabel(
      'allowRTL: true',
    );
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: inherit',
    );
    await expect(element(by.id('is-rtl-information'))).toHaveText(
      'I18nManager.isRTL == false',
    );
  });

  //inherit
  it('Tab Bar Layout Direction: inherit. Tab bar follow system settings - ltr order: Tab1 first from left.', async () => {
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: inherit',
    );

    const tab1attrs = await getElementAttributes('tab-bar-item-1-label');
    const tab2attrs = await getElementAttributes('tab-bar-item-2-label');
    jestExpect(tab2attrs.frame.x).toBeGreaterThan(tab1attrs.frame.x);
  });

  //rtl
  it('Tab Bar Layout Direction: rtl, overridesystem settings. Tab bar displayed in rtl order: Tab2 first from left.', async () => {
    await element(by.id('tab-bar-layout-direction-picker')).tap();
    await element(by.text('rtl')).tap();
    await element(by.id('tab-bar-layout-direction-picker')).tap();
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: rtl',
    );

    const tab1attrs = await getElementAttributes('tab-bar-item-1-label');
    const tab2attrs = await getElementAttributes('tab-bar-item-2-label');
    jestExpect(tab1attrs.frame.x).toBeGreaterThan(tab2attrs.frame.x);
  });

  //ltr
  it('Tab Bar Layout Direction: ltr. Tab bar displayed in ltr order: Tab1 first from left.', async () => {
    await element(by.id('tab-bar-layout-direction-picker')).tap();
    await element(by.text('ltr')).tap();
    await element(by.id('tab-bar-layout-direction-picker')).tap();
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: ltr',
    );

    const tab1attrs = await getElementAttributes('tab-bar-item-1-label');
    const tab2attrs = await getElementAttributes('tab-bar-item-2-label');
    jestExpect(tab2attrs.frame.x).toBeGreaterThan(tab1attrs.frame.x);
  });
});

describe('Tab Bar Layout Direction - system settings: RTL', () => {
  beforeAll(async () => {
    if (device.getPlatform() === 'ios') {
      await device.launchApp({
        newInstance: true,
        launchArgs: {
          AppleTextDirection: 'YES',
          NSForceRightToLeftWritingDirection: 'YES',
          I18NIsRTL: 'YES',
        },
      });
    } else {
      await device.launchApp({ newInstance: true });
      await selectSingleFeatureTestsScreen(
        'Tabs',
        'test-tabs-tab-bar-layout-direction',
      );
      await element(by.id('react-force-rtl-picker')).tap();
      await device.reloadReactNative();
    }
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-tab-bar-layout-direction',
    );
  });

  afterAll(async () => {
    if (device.getPlatform() === 'ios') {
      await device.launchApp({
        newInstance: true,
        launchArgs: {
          AppleTextDirection: 'NO',
          NSForceRightToLeftWritingDirection: 'NO',
          I18NIsRTL: 'NO',
        },
      });
    } else {
      await device.launchApp({ newInstance: true });
      await selectSingleFeatureTestsScreen(
        'Tabs',
        'test-tabs-tab-bar-layout-direction',
      );
      await element(by.id('react-allow-rtl-picker')).tap();
      await device.reloadReactNative();
    }
  });

  it('Tab Bar Layout Direction screen should be displayed with default options. Tab bar follow system settings - rtl order: Tab2 first from left.', async () => {
    await expect(
      element(by.id('tab-bar-layout-direction-picker')),
    ).toBeVisible();
    await expect(
      element(by.id('tab-bar-layout-direction-scrollview')),
    ).toBeVisible();
    await expect(element(by.id('react-force-rtl-picker'))).toHaveLabel(
      'forceRTL: false',
    );
    await expect(element(by.id('react-allow-rtl-picker'))).toHaveLabel(
      'allowRTL: true',
    );
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: inherit',
    );
    await expect(element(by.id('is-rtl-information'))).toHaveText(
      'I18nManager.isRTL == true',
    );
  });

  //inherit
  it('Tab Bar Layout Direction: inherit. Tab bar follow system settings - rtl order: Tab2 first from left.', async () => {
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: inherit',
    );

    const tab1attrs = await getElementAttributes('tab-bar-item-1-label');
    const tab2attrs = await getElementAttributes('tab-bar-item-2-label');
    jestExpect(tab1attrs.frame.x).toBeGreaterThan(tab2attrs.frame.x);
  });

  //rtl
  it('Tab Bar Layout Direction: rtl. Tab bar displayed in rtl order: Tab2 first from left.', async () => {
    await element(by.id('tab-bar-layout-direction-picker')).tap();
    await element(by.text('rtl')).tap();
    await element(by.id('tab-bar-layout-direction-picker')).tap();
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: rtl',
    );

    const tab1attrs = await getElementAttributes('tab-bar-item-1-label');
    const tab2attrs = await getElementAttributes('tab-bar-item-2-label');
    jestExpect(tab1attrs.frame.x).toBeGreaterThan(tab2attrs.frame.x);
  });

  //ltr
  it('Tab Bar Layout Direction: ltr, override system settings. Tab bar displayed in ltr order: Tab1 first from left.', async () => {
    await element(by.id('tab-bar-layout-direction-picker')).tap();
    await element(by.text('ltr')).tap();
    await element(by.id('tab-bar-layout-direction-picker')).tap();
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: ltr',
    );

    const tab1attrs = await getElementAttributes('tab-bar-item-1-label');
    const tab2attrs = await getElementAttributes('tab-bar-item-2-label');
    jestExpect(tab2attrs.frame.x).toBeGreaterThan(tab1attrs.frame.x);
  });
});
