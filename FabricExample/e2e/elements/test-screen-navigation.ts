import { device, expect, element, by, waitFor } from 'detox';
import { expectTopmostVisible, scrollUntilVisible } from '../e2e-utils';

/**
 * Drives the example app's own screen lists — the `root-screen-*` /
 * `*-scrollview` testID scheme lives here rather than in any single test.
 */

/**
 * The example app sections whose test screens are reached by drilling down
 * (root screen -> scenario group -> screen). Issue tests are excluded because
 * that list is searched rather than drilled — see `selectIssueTestScreen`.
 */
type DrilldownSection = 'component-integration-tests' | 'single-feature-tests';

async function selectDrilldownTestScreen(
  section: DrilldownSection,
  scenarioGroup: string,
  screenKey: string,
) {
  const scenarioGroupId = scenarioGroup.replace(/\s/g, '');

  await scrollUntilVisible(
    `root-screen-${section}`,
    'root-screen-examples-scrollview',
  );
  await element(by.id(`root-screen-${section}`)).tap();
  await waitFor(element(by.id(`${section}-scrollview`)))
    .toBeVisible()
    .withTimeout(3000);

  await scrollUntilVisible(
    `${section}-${scenarioGroupId}`,
    `${section}-scrollview`,
  );
  await element(by.id(`${section}-${scenarioGroupId}`)).tap();
  await waitFor(element(by.id(`${scenarioGroupId}-scenarios-scrollview`)))
    .toBeVisible()
    .withTimeout(3000);

  await scrollUntilVisible(
    screenKey,
    `${scenarioGroupId}-scenarios-scrollview`,
  );
  await element(by.id(screenKey)).tap();
}

export async function selectComponentIntegrationTestsScreen(
  scenarioGroup: string,
  screenKey: string,
) {
  await selectDrilldownTestScreen(
    'component-integration-tests',
    scenarioGroup,
    screenKey,
  );
}

export async function selectSingleFeatureTestsScreen(
  scenarioGroup: string,
  screenKey: string,
) {
  await selectDrilldownTestScreen(
    'single-feature-tests',
    scenarioGroup,
    screenKey,
  );
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

    // Only way found to reach the search input: matching by type
    // (androidx.appcompat.widget.SearchView.SearchAutoComplete) fails even
    // though it shows up in Detox's view hierarchy.
    await element(by.text('')).replaceText(screenName);
  } else if (device.getPlatform() === 'ios') {
    await element(by.traits(['searchField'])).typeText(screenName);
  }

  await expect(element(by.id(`issue-tests-${screenName}`))).toBeVisible();
  await element(by.id(`issue-tests-${screenName}`)).tap();
}

/**
 * Waits until the topmost screen shows `Name: <routeName>` — the label the stack
 * test screens render for their route.
 *
 * Indexed to the last match rather than waited on directly: on Android covered
 * screens stay attached, so pushing the same route twice puts two of these
 * labels in the hierarchy and a bare `toBeVisible()` throws "matches N views".
 */
export async function waitForRoute(
  routeName: string,
  timeout = 3000,
): Promise<void> {
  await expectTopmostVisible(by.text(`Name: ${routeName}`), timeout);
}
