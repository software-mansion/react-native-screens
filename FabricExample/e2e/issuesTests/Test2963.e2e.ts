import { device, element, by } from 'detox';
import { describeIfiOS, selectIssueTestScreen } from '../e2e-utils';

// issue related to iOS
describeIfiOS('Test2963', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test2963 should exist', async () => {
    await selectIssueTestScreen('Test2963');
  });

  it('pushing more than 4 modals with header from interval should be possible', async () => {
    await element(by.id('home-button-toggle-screens-limit')).tap();

    await element(by.id('home-button-modals-with-header')).tap();

    await waitFor(element(by.id('screen-5-text')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('screen-5-button-stop')).tap();
  });

  it('pushing more than 4 formSheets with header from interval should be possible', async () => {
    await element(by.id('home-button-form-sheets-with-header')).tap();

    await waitFor(element(by.id('screen-5-text')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('screen-5-button-stop')).tap();
  });

  it('pushing more than 4 push screens with header from interval should be possible', async () => {
    await element(by.id('home-button-push')).tap();

    await waitFor(element(by.id('screen-5-text')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('screen-5-button-stop')).tap();
  });

  it('pushing more than 4 pageSheets with header from interval should be possible', async () => {
    await element(by.id('home-button-page-sheets-with-header')).tap();

    await waitFor(element(by.id('screen-5-text')))
      .toBeVisible()
      .withTimeout(10000);

    await element(by.id('screen-5-button-stop')).tap();
  });
});
