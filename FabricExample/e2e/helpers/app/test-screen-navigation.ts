import { device, expect, element, by, waitFor } from 'detox';
import { scrollUntilVisible } from '@e2e/framework/gestures';
import { DEFAULT_TIMEOUT_MS } from '@e2e/framework/wait';

async function scrollToAndTapInList(id: string, scrollViewId: string) {
  await scrollUntilVisible(id, scrollViewId);
  await element(by.id(id)).tap();
}

export async function selectIssueTestScreen(screenName: string) {
  await scrollToAndTapInList(
    'root-screen-issue-tests',
    'root-screen-examples-scrollview',
  );

  await waitFor(element(by.id('issue-tests-scrollview')))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);

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

/** Root → `section` list → `scenarioGroup` list → `screenKey`. */
async function selectTestsScreen(
  section: 'single-feature-tests' | 'component-integration-tests',
  scenarioGroup: string,
  screenKey: string,
) {
  const scenarioGroupId = scenarioGroup.replace(/\s/g, '');
  const sectionScrollView = `${section}-scrollview`;
  const groupScrollView = `${scenarioGroupId}-scenarios-scrollview`;

  await scrollToAndTapInList(
    `root-screen-${section}`,
    'root-screen-examples-scrollview',
  );
  await waitFor(element(by.id(sectionScrollView)))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);

  await scrollToAndTapInList(
    `${section}-${scenarioGroupId}`,
    sectionScrollView,
  );
  await waitFor(element(by.id(groupScrollView)))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);

  await scrollToAndTapInList(screenKey, groupScrollView);
}

export const selectSingleFeatureTestsScreen = (
  scenarioGroup: string,
  screenKey: string,
) => selectTestsScreen('single-feature-tests', scenarioGroup, screenKey);

export const selectComponentIntegrationTestsScreen = (
  scenarioGroup: string,
  screenKey: string,
) => selectTestsScreen('component-integration-tests', scenarioGroup, screenKey);
