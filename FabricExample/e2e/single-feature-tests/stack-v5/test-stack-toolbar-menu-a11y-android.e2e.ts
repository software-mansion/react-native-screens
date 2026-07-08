import { device, expect, element, by } from 'detox';
import {
  describeIfAndroid,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

describeIfAndroid('Stack Toolbar Menu A11y', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stack v5',
      'test-stack-toolbar-menu-a11y-android',
    );
  });

  it('should find action item by accessibilityLabel', async () => {
    await expect(element(by.label('Accessibility for Alpha'))).toBeVisible();
  });

  it('should find overflow item by accessibilityLabel', async () => {
    await element(by.label('More options')).tap();
    await expect(element(by.label('Accessibility for Beta'))).toBeVisible();
    await device.pressBack();
  });

  it('should find submenu item by accessibilityLabel', async () => {
    await element(by.label('More options')).tap();
    await element(by.label('Accessibility for Gamma')).tap();
    await expect(element(by.label('Accessibility for Delta'))).toBeVisible();
    await device.pressBack();
  });

  it('should update accessibilityLabel via view command', async () => {
    await element(by.id('cmd-target-picker')).tap();
    await element(by.text('action-item')).tap();

    await element(by.id('cmd-label-picker')).tap();
    await element(by.text('Updated label')).tap();

    await element(by.id('send-command-button')).tap();

    await expect(element(by.label('Updated label'))).toBeVisible();
    await expect(element(by.label('Accessibility for Alpha'))).not.toExist();
  });

  it('should reset accessibilityLabel to title fallback', async () => {
    await element(by.id('cmd-label-picker')).tap();
    await element(by.text('undefined')).tap();

    await element(by.id('send-command-button')).tap();

    await expect(element(by.label('Alpha'))).toBeVisible();
    await expect(element(by.label('Updated label'))).not.toExist();
  });
});
