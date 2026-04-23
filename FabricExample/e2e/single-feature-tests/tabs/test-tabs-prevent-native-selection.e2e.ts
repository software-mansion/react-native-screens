import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '../../e2e-utils';
import { Platform } from 'react-native';

describe('Tab Bar preventNativeSelection', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-prevent-native-selection',
    );
  });

  it('preventNativeSelection should be set to false for First tab', async () => {
    await expect(
      element(by.id('tab-bar-prevent-native-selection-view')),
    ).toBeVisible();
    if (device.getPlatform() === 'ios') {
      await expect(element(by.label('More'))).toExist();
    }
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
  });

  it('native selection of first tab should be blocked', async () => {
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
    await element(by.id('prevent-native-selection-button')).tap();
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: true',
    );
    await element(by.id('Second')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Second');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
    await element(by.id('First')).tap();
    await expect(
      element(by.label('1. onTabSelectionPrevented: First')),
    ).toBeVisible();
    await element(by.label('1. onTabSelectionPrevented: First')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Second');
  });

  it('programmatic navigation to first tab should not be blocked', async () => {
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Second');
    await element(by.id('first-button')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: true',
    );
  });

  it('native selection should be possible after disabling preventNativeSelection', async () => {
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: true',
    );
    await element(by.id('prevent-native-selection-button')).tap();
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
    await element(by.id('Fourth')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Fourth');
    await element(by.id('First')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
  });

  it('native selection should be possible after disabling preventNativeSelection', async () => {
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await element(by.id('Third')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Third');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
    await element(by.id('prevent-native-selection-button')).tap();
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: true',
    );
    await element(by.id('Fourth')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Fourth');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
    await element(by.id('prevent-native-selection-button')).tap();
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: true',
    );
    await element(by.id('Third')).tap();
    await expect(
      element(by.label('1. onTabSelectionPrevented: Third')),
    ).toBeVisible();
    await element(by.label('1. onTabSelectionPrevented: Third')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Fourth');
    await element(by.id('First')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
  });
  //iOS only
  it('preventNativeSelection for tabs hidden under More tab blocks native selection', async () => {
    if (device.getPlatform() !== 'ios') {
      return;
    }
    await element(by.id('fifth-button')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Fifth');
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );
    await element(by.id('prevent-native-selection-button')).tap();
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: true',
    );

    await element(by.id('sixth-button')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Sixth');
    await element(by.id('prevent-native-selection-button')).tap();
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: true',
    );

    await element(by.id('first-button')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await element(by.label('More')).atIndex(0).tap();
    await expect(
      element(by.label('1. onTabSelectionPrevented: Sixth')),
    ).toBeVisible();
    await element(by.label('1. onTabSelectionPrevented: Sixth')).tap();
    await expect(element(by.label('Fifth'))).toBeVisible();
    await expect(element(by.label('Sixth'))).toBeVisible();

    await element(by.label('Fifth')).tap();
    await expect(
      element(by.label('1. onTabSelectionPrevented: Fifth')),
    ).toBeVisible();
    await element(by.label('1. onTabSelectionPrevented: Fifth')).tap();

    await element(by.id('First')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await element(by.id('fifth-button')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Fifth');
    await element(by.id('prevent-native-selection-button')).tap();
    await expect(element(by.id('prevent-native-selection-state'))).toHaveLabel(
      'preventNativeSelection: false',
    );

    await element(by.id('First')).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('First');
    await element(by.label('More')).atIndex(0).tap();
    await expect(element(by.id('screen-name-label'))).toHaveLabel('Fifth');
    await expect(element(by.id('Fifth'))).not.toBeVisible();
    await expect(element(by.id('Sixth'))).not.toBeVisible();
  });
});
