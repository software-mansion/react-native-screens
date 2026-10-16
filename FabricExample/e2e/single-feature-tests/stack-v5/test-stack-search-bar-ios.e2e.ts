import { by, device, element, expect, waitFor } from 'detox';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';

const searchField = () => element(by.type('UISearchTextField'));

async function tapControl(id: string) {
  await element(by.id('search-controls')).scrollTo('top');
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id('search-controls'))
    .scroll(150, 'down', 0.5, 0.35);
  await element(by.id(id)).tap();
}

async function expectUnfocused() {
  await expect(searchField()).not.toBeFocused();
}

describeIfiOS('Stack search bar (iOS)', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-search-bar-ios',
    );
  });

  it('keeps search unfocused when a filter menu action updates the header', async () => {
    await expect(searchField()).toBeVisible();
    await element(by.text('Filters')).tap();
    await element(by.text('Apply filter')).tap();
    await expect(element(by.id('filter-count'))).toHaveText('Filters: 1');
    await expectUnfocused();
    await expect(searchField()).toHaveText('');
  });

  it('forwards focus, text, submit, blur and cancel events', async () => {
    await tapControl('focus-search');
    await expect(element(by.id('search-focus'))).toHaveText(
      'Last focus event: focus',
    );
    await expect(searchField()).toBeFocused();
    await searchField().typeText('query');
    await expect(element(by.id('search-text'))).toHaveText('Text: query');
    await searchField().tapReturnKey();
    await expect(element(by.id('search-submit'))).toHaveText(
      'Submitted: query',
    );
    await tapControl('blur-search');
    await expectUnfocused();
    await expect(element(by.id('search-focus'))).toHaveText(
      'Last focus event: blur',
    );
    await tapControl('focus-search');
    await tapControl('cancel-search');
    await expectUnfocused();
    await expect(element(by.id('search-cancel'))).toHaveText('Cancelled: 1');
    await expect(searchField()).toHaveText('');
  });

  it('runs text and cancel-button ref commands without focusing search', async () => {
    await tapControl('set-search-text');
    await expect(searchField()).toHaveText('native command');
    await tapControl('clear-search-text');
    await expect(searchField()).toHaveText('');
    await tapControl('show-cancel');
    await tapControl('hide-cancel');
    await expectUnfocused();
  });

  it('dismisses and resets a replaced or removed search controller', async () => {
    await tapControl('focus-search');
    await searchField().typeText('old');
    await tapControl('replace-search');
    await expect(searchField()).toHaveText('');
    await expectUnfocused();
    await tapControl('focus-search');
    await tapControl('toggle-search');
    await expect(searchField()).not.toExist();
    await tapControl('toggle-search');
    await expect(searchField()).toHaveText('');
    await expectUnfocused();
  });

  it('updates scrolling options when only SearchBar props change', async () => {
    await tapControl('toggle-scroll');
    await expect(element(by.text('Hide when scrolling: true'))).toExist();
    await expectUnfocused();
    await element(by.id('search-controls')).scroll(300, 'down', 0.5, 0.55);
    await expect(searchField()).not.toBeVisible();
    await element(by.text('Filters')).tap();
    await element(by.text('Toggle hide when scrolling')).tap();
    await expect(element(by.text('Hide when scrolling: false'))).toExist();
    await expect(searchField()).toBeVisible();
    await expectUnfocused();
  });

  it('clears search when the entire header is unmounted', async () => {
    await tapControl('focus-search');
    await tapControl('toggle-header');
    await expect(searchField()).not.toExist();
    await tapControl('toggle-header');
    await expect(searchField()).toHaveText('');
    await expectUnfocused();
  });

  it('restores the correct unfocused search controller after push and pop', async () => {
    await tapControl('focus-search');
    await searchField().typeText('home');
    await tapControl('push-details');
    await expect(searchField()).not.toExist();
    await element(by.id('pop-details')).tap();
    await expect(searchField()).toHaveText('');
    await expectUnfocused();
    await tapControl('set-search-text');
    await expect(searchField()).toHaveText('native command');
    await expectUnfocused();
    await tapControl('push-search');
    await expect(element(by.id('search-screen-name'))).toHaveText('Search');
    await expect(searchField()).toHaveText('');
    await tapControl('focus-search');
    await searchField().typeText('second');
    await tapControl('pop-search');
    await expect(element(by.id('search-screen-name'))).toHaveText('Home');
    await expect(searchField()).toHaveText('native command');
    await expectUnfocused();
  });
});
