import { device, expect, element, by } from 'detox';
import {
  forceTapByLabeliOS,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

describe('@smoke Tabs: simple navigation', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen('Tabs', 'test-tabs-simple-nav');
  });

  it('should display First tab as active by default', async () => {
    await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  });

  it('should navigate to Second tab via tab bar', async () => {
    await element(by.id('tab-bar-item-second')).tap();
    await expect(element(by.id('route-key-label'))).toHaveLabel('Second');
  });

  it('should navigate to Third tab via tab bar', async () => {
    await element(by.id('tab-bar-item-third')).tap();
    await expect(element(by.id('route-key-label'))).toHaveLabel('Third');
  });

  it('should navigate back to First tab via tab bar', async () => {
    await element(by.id('tab-bar-item-first')).tap();
    await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  });

  it('should navigate to Second tab programmatically via Select Second button', async () => {
    await element(by.id('select-second-button')).tap();
    await expect(element(by.id('route-key-label'))).toHaveLabel('Second');
  });

  it('should navigate to Third tab programmatically via Select Third button', async () => {
    await element(by.id('select-third-button')).tap();
    await expect(element(by.id('route-key-label'))).toHaveLabel('Third');
  });

  it('should navigate to First tab programmatically via Select First button', async () => {
    await element(by.id('select-first-button')).tap();
    await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  });

  it('should skip Second tab when navigating directly from First to Third programmatically', async () => {
    await expect(element(by.id('route-key-label'))).toHaveLabel('First');
    await element(by.id('select-third-button')).tap();
    await expect(element(by.id('route-key-label'))).toHaveLabel('Third');
  });

  it('should skip Second tab when navigating directly from Third to First via tab bar', async () => {
    await expect(element(by.id('route-key-label'))).toHaveLabel('Third');
    await element(by.id('tab-bar-item-first')).tap();
    await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  });

  it('should navigate correctly after mixing tab-bar and programmatic navigation', async () => {
    await element(by.id('tab-bar-item-second')).tap();
    await expect(element(by.id('route-key-label'))).toHaveLabel('Second');
    await element(by.id('select-first-button')).tap();
    await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  });

  it('should stay on First tab when re-tapping the active First tab bar item', async () => {
    await expect(element(by.id('route-key-label'))).toHaveLabel('First');
    device.getPlatform() === 'ios'
      ? await forceTapByLabeliOS('FirstTab')
      : await element(by.id('tab-bar-item-first')).tap();
    await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  });

  it('should stay on First tab when calling selectTab on the already-active tab programmatically', async () => {
    await expect(element(by.id('route-key-label'))).toHaveLabel('First');
    await element(by.id('select-first-button')).tap();
    await expect(element(by.id('route-key-label'))).toHaveLabel('First');
  });
});
