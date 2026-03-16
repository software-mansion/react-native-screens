import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectIssueTestScreen } from '../e2e-utils';
import isVersionEqualOrHigherThan from '../helpers/isVersionEqualOrHigherThan';

const { getIOSVersionNumber } = require('../../../scripts/e2e/ios-devices.js');

// On iOS 26+ cancel button does not contain any text.
function getSearchBarCloseButton() {
  const iosVersion = getIOSVersionNumber();
  if (isVersionEqualOrHigherThan(iosVersion, '26.0')) {
    return element(by.label('Close').and(by.traits(['button'])));
  } else {
    return element(by.text('Cancel text'));
  }
}

// PR related to iOS search bar
describeIfiOS('Test758', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test758 should exist', async () => {
    await selectIssueTestScreen('Test758');
  });

  it('search bar should not be initially visible', async () => {
    await expect(element(by.traits(['searchField']))).not.toBeVisible();
  });

  it('search bar should appear on scroll', async () => {
    await element(by.text('Stuff')).swipe('down');
    await expect(element(by.traits(['searchField']))).toBeVisible();
  });

  it('search bar should have correct placeholder text', async () => {
    await expect(element(by.text('Placeholder text'))).toBeVisible();
  });

  it('search bar should show correct cancel button when focused', async () => {
    await element(by.traits(['searchField'])).tap();
    await expect(getSearchBarCloseButton()).toBeVisible();
  });

  it('cancel button should disappear after being clicked', async () => {
    await getSearchBarCloseButton().tap();
    await expect(getSearchBarCloseButton()).not.toBeVisible();
  });

  it('search bar should show correct results', async () => {
    await element(by.traits(['searchField'])).tap();
    await element(by.traits(['searchField'])).typeText('th');

    await expect(element(by.text('Other'))).toBeVisible();
    await expect(element(by.text('The'))).toBeVisible();
    await expect(element(by.text('Nuggets'))).not.toBeVisible();
  });

  it('search bar should not be visible on another screen', async () => {
    await element(by.text('Tap me for second screen')).tap();
    await expect(element(by.traits(['searchField']))).not.toBeVisible();
  });

  it('search bar query should still be present after coming back from another screen', async () => {
    await element(by.text('First')).tap();
    await expect(element(by.text('th'))).toBeVisible();
  });

  it('search results should still be correct after coming back from another screen', async () => {
    await expect(element(by.text('Other'))).toBeVisible();
    await expect(element(by.text('The'))).toBeVisible();
    await expect(element(by.text('Nuggets'))).not.toBeVisible();
  });

  it('search should still be responsive after coming back from another screen', async () => {
    await element(by.traits(['searchField'])).clearText();
    await expect(element(by.text('Nuggets'))).toBeVisible();
  });
});
