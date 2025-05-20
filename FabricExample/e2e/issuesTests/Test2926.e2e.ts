import { device, expect, element, by } from 'detox';
import { describeIfiOS } from '../e2e-utils';

// PR related to iOS search bar
describeIfiOS('Test2926', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test2926 should exist', async () => {
    await waitFor(element(by.id('root-screen-tests-Test2926')))
      .toBeVisible()
      .whileElement(by.id('root-screen-examples-scrollview'))
      .scroll(600, 'down', NaN, 0.85);

    await expect(element(by.id('root-screen-tests-Test2926'))).toBeVisible();
    await element(by.id('root-screen-tests-Test2926')).tap();
  });

  it('searchBar should be initially visible', async () => {
    await expect(element(by.type('UISearchBarTextField'))).toBeVisible();
  });

  it('searchBar should hide after setting headerSearchBarOptions to undefined', async () => {
    await element(by.id('home-switch-search-enabled')).tap();
    await expect(element(by.type('UISearchBarTextField'))).not.toBeVisible();
  });

  it('searchBar value should stay in text field after coming back from another screen', async () => {
    await element(by.id('home-switch-search-enabled')).tap();

    await element(by.type('UISearchBarTextField')).replaceText('Item 2');
    await element(by.id('home-button-open-second')).tap();

    await element(by.id('BackButton')).tap();

    await expect(element(by.type('UISearchBarTextField'))).toBeVisible();
    await expect(element(by.type('UISearchBarTextField'))).toHaveText('Item 2');
  });
});
