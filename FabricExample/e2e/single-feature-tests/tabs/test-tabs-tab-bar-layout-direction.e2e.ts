import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '../../e2e-utils';
import { AndroidElementAttributes, IosElementAttributes } from 'detox/detox';

type ElementAttributes = IosElementAttributes | AndroidElementAttributes;

async function getElementAttributes(
  testLabel: string,
): Promise<ElementAttributes> {
  const attrs = await element(by.label(testLabel)).getAttributes();
  return attrs as ElementAttributes;
}

async function scrollTo(id: string) {
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id('tab-bar-layout-direction-scrollview'))
    .scroll(100, 'down');
}

describe('Tab Bar Layout Direction - system settings: LTR', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-tab-bar-layout-direction',
    );
  });

  it('displays default options and renders Tab1 at the visually leftmost position (LTR)', async () => {
    await expect(
      element(by.id('tab-bar-layout-direction-scrollview')),
    ).toBeVisible();
    await expect(element(by.id('react-force-rtl-picker'))).toHaveLabel(
      'forceRTL: false',
    );
    await expect(element(by.id('react-allow-rtl-picker'))).toHaveLabel(
      'allowRTL: true',
    );
    await scrollTo('tab-bar-layout-direction-picker');
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: inherit',
    );
    await expect(element(by.id('is-rtl-information'))).toHaveText(
      'I18nManager.isRTL == false',
    );
  });

  //inherit
  it('follows system LTR settings when direction is set to inherit', async () => {
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: inherit',
    );

    const tab1attrs = await getElementAttributes('tab-bar-item-1-label');
    const tab2attrs = await getElementAttributes('tab-bar-item-2-label');
    jestExpect(tab2attrs.frame.x).toBeGreaterThan(tab1attrs.frame.x);
  });

  //rtl
  it('overrides system LTR settings and renders the tab bar in RTL order', async () => {
    await scrollTo('tab-bar-layout-direction-picker');
    await element(by.id('tab-bar-layout-direction-picker')).tap();
    await waitFor(element(by.text('rtl')))
      .toBeVisible()
      .whileElement(by.id('tab-bar-layout-direction-scrollview'))
      .scroll(100, 'down');
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
  it('remains in LTR order when direction is explicitly set to ltr', async () => {
    await scrollTo('tab-bar-layout-direction-picker');
    await element(by.id('tab-bar-layout-direction-picker')).tap();
    await scrollTo('ltr');
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

  it('displays default options and renders Tab2 at the visually leftmost position (RTL)', async () => {
    await expect(
      element(by.id('tab-bar-layout-direction-scrollview')),
    ).toBeVisible();
    await expect(element(by.id('react-force-rtl-picker'))).toHaveLabel(
      'forceRTL: false',
    );
    await expect(element(by.id('react-allow-rtl-picker'))).toHaveLabel(
      'allowRTL: true',
    );
    await scrollTo('tab-bar-layout-direction-picker');
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: inherit',
    );
    await expect(element(by.id('is-rtl-information'))).toHaveText(
      'I18nManager.isRTL == true',
    );
  });

  //inherit
  it('follows system RTL settings when direction is set to inherit', async () => {
    await expect(element(by.id('tab-bar-layout-direction-picker'))).toHaveLabel(
      'direction: inherit',
    );

    const tab1attrs = await getElementAttributes('tab-bar-item-1-label');
    const tab2attrs = await getElementAttributes('tab-bar-item-2-label');
    jestExpect(tab1attrs.frame.x).toBeGreaterThan(tab2attrs.frame.x);
  });

  //rtl
  it('remains in RTL order when direction is explicitly set to rtl', async () => {
    await scrollTo('tab-bar-layout-direction-picker');
    await element(by.id('tab-bar-layout-direction-picker')).tap();
    await scrollTo('rtl');
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
  it('overrides system RTL settings and renders the tab bar in LTR order', async () => {
    await scrollTo('tab-bar-layout-direction-picker');
    await element(by.id('tab-bar-layout-direction-picker')).tap();
    await waitFor(element(by.text('ltr')))
      .toBeVisible()
      .whileElement(by.id('tab-bar-layout-direction-scrollview'))
      .scroll(100, 'down');
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
