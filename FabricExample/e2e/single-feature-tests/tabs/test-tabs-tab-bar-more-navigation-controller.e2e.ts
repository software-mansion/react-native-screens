import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '../../e2e-utils';

describe('Tab Bar Hidden', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-more-navigation-controller',
    );
  });

  it('screen should be displayed with 4 tabs and More tab visible', async () => {
    await expect(
      element(by.id('test-tabs-more-navigation-controller-view')),
    ).toBeVisible();
    const toast = element(by.label('1. onTabSelected: "First"'));
    await expect(toast).toBeVisible();
    await toast.tap();

    await expect(element(by.type('UITabBar'))).toBeVisible();
    await expect(element(by.id('First'))).toBeVisible();
    await expect(element(by.id('Second'))).toBeVisible();
    await expect(element(by.id('Third'))).toBeVisible();
    await expect(element(by.id('Fourth'))).toBeVisible();
    await expect(element(by.id('Fifth'))).not.toBeVisible();
    await expect(element(by.id('Sixth'))).not.toBeVisible();
    await expect(element(by.label('More'))).toExist();
  });

  it('navigation using tab bar should work correctly', async () => {
    await element(by.label('More')).atIndex(0).tap();
    await expect(element(by.label('1. onMoreTabSelected'))).toBeVisible();
    await element(by.label('1. onMoreTabSelected')).tap();
    await expect(element(by.label('Fifth'))).toBeVisible();
    await expect(element(by.label('Sixth'))).toBeVisible();

    await element(by.label('Fifth')).tap();
    await expect(element(by.id('Fifth-content-view'))).toBeVisible();
    await element(by.label('1. onTabSelected: "Fifth"')).tap();
    await expect(element(by.id('Fifth'))).not.toBeVisible();

    await element(by.id('Third')).tap();
    await expect(element(by.id('Third-content-view'))).toBeVisible();
    await element(by.label('1. onTabSelected: "Third"')).tap();

    await element(by.label('More')).atIndex(0).tap();
    await expect(element(by.id('Fifth-content-view'))).toBeVisible();
    await element(by.label('2. onTabSelected: "Fifth"')).tap(); //After fix of issue #1140 this step should be deleted
    await element(by.label('1. onTabSelected: "Fifth"')).tap();
    await expect(element(by.id('Fifth'))).not.toBeVisible();
    await expect(element(by.id('Sixth'))).not.toBeVisible();

    await element(by.label('More')).atIndex(0).tap();
    await expect(element(by.label('1. onMoreTabSelected'))).toBeVisible();
    await expect(element(by.label('Fifth'))).toBeVisible();
    await expect(element(by.label('Sixth'))).toBeVisible();
    await element(by.label('1. onMoreTabSelected')).tap();

    await element(by.label('Sixth')).tap();
    await expect(element(by.id('Sixth-content-view'))).toBeVisible();
    await element(by.label('1. onTabSelected: "Sixth"')).tap();
    await expect(element(by.id('Sixth'))).not.toBeVisible();
  });

  it('navigation using programmatic buttons should work correctly', async () => {
    await element(by.label('Select Fourth')).tap();
    await expect(element(by.id('Fourth-content-view'))).toBeVisible();
    await element(by.label('1. onTabSelected: "Fourth"')).tap();

    await element(by.label('Select Fifth')).tap();
    await expect(element(by.id('Fifth-content-view'))).toBeVisible();
    await element(by.label('3. onTabSelected: "Fifth"')).tap(); //After fix of issue #1140 this step should be deleted
    await element(by.label('2. onTabSelected: "Fifth"')).tap(); //After fix of issue #1140 this step should be deleted
    await element(by.label('1. onTabSelected: "Fifth"')).tap();

    await element(by.label('Select First')).tap();
    await expect(element(by.id('First-content-view'))).toBeVisible();
    await element(by.label('1. onTabSelected: "First"')).tap();

    await element(by.label('Select Sixth')).tap();
    await expect(element(by.id('Sixth-content-view'))).toBeVisible();
    await element(by.label('3. onTabSelected: "Sixth"')).tap(); //After fix of issue #1140 this step should be deleted
    await element(by.label('2. onTabSelected: "Sixth"')).tap(); //After fix of issue #1140 this step should be deleted
    await element(by.label('1. onTabSelected: "Sixth"')).tap();
  });
});
