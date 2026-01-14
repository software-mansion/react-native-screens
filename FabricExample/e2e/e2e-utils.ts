import { device, expect, element, by } from 'detox';

export const describeIfiOS =
  device.getPlatform() === 'ios' ? describe : describe.skip;

async function scrollTo(id: string) {
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id('root-screen-examples-scrollview'))
    .scroll(600, 'down', Number.NaN, 0.85);
}

export async function selectIssueTestScreen(screenName: string) {
  await scrollTo('root-screen-issue-tests');
  await element(by.id('root-screen-issue-tests')).tap();

  await waitFor(element(by.id('issue-tests-scrollview'))).toBeVisible();

  if (device.getPlatform() === 'android') {
    await element(by.label('Search')).tap();

    // This is the only way I was able to get the search box text input.
    // I don't know why element(by.type('androidx.appcompat.widget.SearchView.SearchAutoComplete'))
    // does not work even if it appears in view hierarchy returned by Detox in debug logging mode.
    await element(by.text('')).replaceText(screenName);
  } else if (device.getPlatform() === 'ios') {
    await element(by.traits(['searchField'])).typeText(screenName);
  }

  await expect(element(by.id(`issue-tests-${screenName}`))).toBeVisible();
  await element(by.id(`issue-tests-${screenName}`)).tap();
}
