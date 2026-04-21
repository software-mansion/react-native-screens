import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '../../e2e-utils';

describe('Tab Bar More Navigation Controller', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-more-navigation-controller',
    );
    await expect(element(by.label('1. onTabSelected: "First"'))).toBeVisible();
    await element(by.label('1. onTabSelected: "First"')).tap();
  });

  it('screen should be displayed with 4 tabs and More tab visible', async () => {
    await expect(
      element(by.id('test-tabs-more-navigation-controller-view')),
    ).toBeVisible();
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
    await expect(element(by.label('Sixth'))).not.toBeVisible();

    await element(by.id('Third')).tap();
    await expect(element(by.id('Third-content-view'))).toBeVisible();
    await element(by.label('1. onTabSelected: "Third"')).tap();

    await element(by.label('More')).atIndex(0).tap();
    await expect(element(by.id('Fifth-content-view'))).toBeVisible();
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
    await expect(element(by.id('Fifth'))).not.toBeVisible();
    await expect(element(by.id('Sixth'))).not.toBeVisible();
  });

  it('navigation using programmatic buttons should work correctly', async () => {
    await element(by.label('Select Fourth')).tap();
    await expect(element(by.id('Fourth-content-view'))).toBeVisible();
    await element(by.label('1. onTabSelected: "Fourth"')).tap();
    await expect(element(by.id('Fifth'))).not.toBeVisible();
    await expect(element(by.id('Sixth'))).not.toBeVisible();

    await element(by.label('Select Fifth')).tap();
    await expect(element(by.id('Fifth-content-view'))).toBeVisible();
    await element(by.label('1. onTabSelected: "Fifth"')).tap();
    await expect(element(by.id('Fifth'))).not.toBeVisible();
    await expect(element(by.id('Sixth'))).not.toBeVisible();

    await element(by.label('Select First')).tap();
    await expect(element(by.id('First-content-view'))).toBeVisible();
    await element(by.label('1. onTabSelected: "First"')).tap();

    await element(by.label('Select Sixth')).tap();
    await expect(element(by.id('Sixth-content-view'))).toBeVisible();
    await element(by.label('1. onTabSelected: "Sixth"')).tap();
    await expect(element(by.id('Fifth'))).not.toBeVisible();
    await expect(element(by.id('Sixth'))).not.toBeVisible();
  });

  it('repeated More tab selection', async () => {
    await element(by.label('More')).atIndex(0).tap();
    await expect(element(by.label('1. onMoreTabSelected'))).toBeVisible();
    await element(by.label('1. onMoreTabSelected')).tap();
    await expect(element(by.label('Fifth'))).toBeVisible();
    await expect(element(by.label('Sixth'))).toBeVisible();
    await element(by.label('More')).atIndex(0).tap();
    await expect(element(by.label('1. onMoreTabSelected'))).not.toBeVisible();
    await element(by.label('More')).atIndex(0).tap();
    await expect(element(by.label('1. onMoreTabSelected'))).not.toBeVisible();
  });
});
