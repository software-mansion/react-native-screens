import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';
import { CLASS_NAME_UI_BUTTON_BAR_BUTTON } from '../../native-class-names';

function navigationBar(title: string) {
  return by.type('UINavigationBar').withDescendant(by.text(title));
}

// This scenario has no leading/trailing items. The only native button in
// its navigation bar is UIKit's back button. Scope to the title so that the
// example app's enclosing navigator cannot satisfy the assertion.
function backButton(title: string) {
  return element(
    by.type(CLASS_NAME_UI_BUTTON_BAR_BUTTON).withAncestor(navigationBar(title)),
  );
}

async function expectHiddenBackButton(title: string) {
  await expect(element(navigationBar(title))).toBeVisible();
  await expect(backButton(title)).not.toExist();
}

describeIfiOS('Stack v5: backButtonHidden', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-back-button-hidden-ios',
    );
  });

  it('keeps the root back-button-free and hides the initial pushed back button', async () => {
    await element(by.text('Set root backButtonHidden false')).tap();
    await expectHiddenBackButton('Root');
    await element(by.text('Push Visibility')).tap();
    await expectHiddenBackButton('Visibility');
  });

  it('updates visibility and restores the default when the prop is removed', async () => {
    await element(by.text('Set false')).tap();
    await expect(backButton('Visibility')).toBeVisible();
    await element(by.text('Set true')).tap();
    await expectHiddenBackButton('Visibility');
    await element(by.text('Remove prop')).tap();
    await expect(backButton('Visibility')).toBeVisible();
  });

  it('applies visibility to the current screen without hiding the next screen back button', async () => {
    await element(by.text('Set true')).tap();
    await element(by.text('Push Default')).tap();
    await expect(backButton('Default')).toBeVisible();
    await element(by.text('Pop Default')).tap();
    await expectHiddenBackButton('Visibility');
  });

  it('removes and remounts the header config without retaining hidden state', async () => {
    await element(by.text('Remove header config')).tap();
    await expect(element(navigationBar('Visibility'))).not.toExist();
    await element(by.text('Push Default')).tap();
    await expect(backButton('Default')).toBeVisible();
    await element(by.text('Pop Default')).tap();
    await expect(element(navigationBar('Visibility'))).not.toExist();
    await element(by.text('Remove prop')).tap();
    await element(by.text('Mount header config')).tap();
    await expect(backButton('Visibility')).toBeVisible();
  });

  it('starts a new pushed instance with its initial hidden configuration', async () => {
    await element(by.text('Pop Visibility')).tap();
    await expectHiddenBackButton('Root');
    await element(by.text('Push Visibility')).tap();
    await expectHiddenBackButton('Visibility');
  });
});
