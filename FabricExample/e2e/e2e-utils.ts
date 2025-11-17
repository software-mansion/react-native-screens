import { device, expect, element, by } from 'detox';

export const describeIfiOS = device.getPlatform() === 'ios' ? describe : describe.skip;

export async function selectTestScreen(screenName: string) {
  await element(by.id('root-screen-switch-search-bar')).tap();

  if (device.getPlatform() === 'android') {
    await element(by.label('Search')).tap();

    // This is the only way I was able to get the search box text input.
    // I don't know why element(by.type('androidx.appcompat.widget.SearchView.SearchAutoComplete'))
    // does not work even if it appears in view hierarchy returned by Detox in debug logging mode.
    await element(by.text('')).replaceText(screenName);

    // Press back to hide the keyboard.
    // This is necessary to make sure that search results are not obstructed by the keyboard.
    // More details: https://github.com/software-mansion/react-native-screens/pull/2919
    await device.pressBack();
  } else {
    await waitFor(element(by.id('root-screen-tests-' + screenName)))
      .toBeVisible()
      .whileElement(by.id('root-screen-examples-scrollview'))
      .scroll(600, 'down', Number.NaN, 0.85);
  }

  await expect(element(by.id(`root-screen-tests-${screenName}`))).toBeVisible();
  await element(by.id(`root-screen-tests-${screenName}`)).tap();
}
