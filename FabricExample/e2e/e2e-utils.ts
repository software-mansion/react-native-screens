import { device, expect, element, by } from 'detox';
import { AndroidElementAttributes, IosElementAttributes } from 'detox/detox';

export const describeIfiOS =
  device.getPlatform() === 'ios' ? describe : describe.skip;

export const describeIfAndroid =
  device.getPlatform() === 'android' ? describe : describe.skip;

async function scrollUntilVisible(id: string, scrollViewId: string) {
  await waitFor(element(by.id(id)))
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(600, 'down', Number.NaN, 0.85);
}

export async function selectIssueTestScreen(screenName: string) {
  await scrollUntilVisible(
    'root-screen-issue-tests',
    'root-screen-examples-scrollview',
  );
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

export async function selectSingleFeatureTestsScreen(
  scenarioGroup: string,
  screenKey: string,
) {
  await scrollUntilVisible(
    'root-screen-single-feature-tests',
    'root-screen-examples-scrollview',
  );
  await element(by.id('root-screen-single-feature-tests')).tap();
  await waitFor(element(by.id('single-feature-tests-scrollview')))
    .toBeVisible()
    .withTimeout(3000);

  await scrollUntilVisible(
    `single-feature-tests-${scenarioGroup}`,
    'single-feature-tests-scrollview',
  );
  await element(by.id(`single-feature-tests-${scenarioGroup}`)).tap();
  await waitFor(element(by.id(`${scenarioGroup}-scenarios-scrollview`)))
    .toBeVisible()
    .withTimeout(3000);

  await scrollUntilVisible(
    `${screenKey}`,
    `${scenarioGroup}-scenarios-scrollview`,
  );
  await element(by.id(`${screenKey}`)).tap();
}
type ElementAttributes = IosElementAttributes | AndroidElementAttributes;

export async function getElementAttributes(
  testLabel: string,
): Promise<ElementAttributes> {
  const attrs = await element(by.label(testLabel)).getAttributes();
  
  if ('elements' in attrs) {
    throw new Error(
      `Multiple elements (${attrs.elements.length}) found for label: "${testLabel}". `
    );
  }
  
  return attrs as ElementAttributes;
}

export async function tapSelectedTab(testLabel: string) {
  if (device.getPlatform() === 'ios') {
    const elementAttributes = await getElementAttributes(testLabel);
    const { x, y, width, height } = elementAttributes.frame;
    await device.tap({
      x: x + width / 2,
      y: y + height / 2,
    });
  } else {
    await element(by.label(testLabel)).tap();
  }
}
