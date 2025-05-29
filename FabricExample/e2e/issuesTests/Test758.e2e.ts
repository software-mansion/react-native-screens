import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectTestScreen } from '../e2e-utils';

// PR related to iOS search bar
describeIfiOS('Test758', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test758 should exist', async () => {
    await selectTestScreen('Test758');
  });

  it('search bar should not be initially visible', async () => {
    await expect(element(by.type('UISearchBarTextField'))).not.toBeVisible();
  });

  it('search bar should appear on scroll', async () => {
    await element(by.text('Stuff')).swipe('down');
    await expect(element(by.type('UISearchBarTextField'))).toBeVisible();
  });

  it('search bar should have correct placeholder text', async () => {
    await expect(element(by.text('Placeholder text'))).toBeVisible();
  });

  it('search bar should show correct cancel button text when focused', async () => {
    await element(by.type('UISearchBarTextField')).tap();
    await expect(element(by.text('Cancel text'))).toBeVisible();
  });

  it('cancel button should disappear after being clicked', async () => {
    await element(by.text('Cancel text')).tap();
    await expect(element(by.text('Cancel text'))).not.toBeVisible();
  });

  it('search bar should show correct results', async () => {
    await element(by.type('UISearchBarTextField')).tap();
    await element(by.type('UISearchBarTextField')).typeText('th');

    await expect(element(by.text('Other'))).toBeVisible();
    await expect(element(by.text('The'))).toBeVisible();
    await expect(element(by.text('Nuggets'))).not.toBeVisible();
  });

  it('search bar should not be visible on another screen', async () => {
    await element(by.text('Tap me for second screen')).tap();
    await expect(element(by.type('UISearchBarTextField'))).not.toBeVisible();
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
    await element(by.type('UISearchBarTextField')).clearText();
    await expect(element(by.text('Nuggets'))).toBeVisible();
  });
});
