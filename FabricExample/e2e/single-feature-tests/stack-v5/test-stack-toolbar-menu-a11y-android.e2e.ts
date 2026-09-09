import { device, expect, element, by } from 'detox';
import {
  describeIfAndroid,
  openOverflowMenu,
  selectPickerOption,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

// No scroll view testID on this screen: pickers are tapped in place and the
// popup is closed with a plain Back press.
const setTarget = (option: 'action-item' | 'overflow-item') =>
  selectPickerOption({
    pickerId: 'cmd-target-picker',
    label: 'target id',
    option,
  });

const setLabel = (option: 'Updated label' | 'undefined') =>
  selectPickerOption({
    pickerId: 'cmd-label-picker',
    label: 'accessibilityLabel',
    option,
  });

const sendCommand = () => element(by.id('send-command-button')).tap();

describeIfAndroid('Stack Toolbar Menu A11y', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-toolbar-menu-a11y-android',
    );
  });

  it('should find action item by accessibilityLabel', async () => {
    await expect(element(by.label('Accessibility for Alpha'))).toBeVisible();
  });

  it('should find overflow item by accessibilityLabel', async () => {
    await openOverflowMenu();
    await expect(element(by.label('Accessibility for Beta'))).toBeVisible();
    await expect(element(by.label('Accessibility for Gamma'))).toBeVisible();
    await device.pressBack();
  });

  it('should find submenu item by accessibilityLabel', async () => {
    await openOverflowMenu();
    await element(by.label('Accessibility for Gamma')).tap();
    await expect(element(by.label('Accessibility for Delta'))).toBeVisible();
    await device.pressBack();
  });

  it('should update accessibilityLabel via view command', async () => {
    await setTarget('action-item');
    await setLabel('Updated label');
    await sendCommand();

    await expect(element(by.label('Updated label'))).toBeVisible();
    await expect(element(by.label('Accessibility for Alpha'))).not.toExist();
  });

  it('should reset accessibilityLabel to title fallback', async () => {
    await setLabel('undefined');
    await sendCommand();

    await expect(element(by.label('Alpha'))).toBeVisible();
    await expect(element(by.label('Updated label'))).not.toExist();
  });

  it('should update overflow item accessibilityLabel via view command', async () => {
    await setTarget('overflow-item');
    await setLabel('Updated label');
    await sendCommand();

    await openOverflowMenu();
    await expect(element(by.label('Updated label'))).toBeVisible();
    await device.pressBack();
  });

  it('should reset overflow item to no content description', async () => {
    await setLabel('undefined');
    await sendCommand();

    await openOverflowMenu();

    await expect(element(by.text('Beta'))).toBeVisible();
    await expect(element(by.label('Updated label'))).not.toExist();
    await expect(element(by.label('Accessibility for Beta'))).not.toExist();

    await device.pressBack();
  });
});
