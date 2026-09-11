import { device, expect, element, by, waitFor } from 'detox';
import { scrollToAndTap } from '@e2e/framework/gestures';
import { DEFAULT_TIMEOUT_MS } from '@e2e/framework/wait';

export async function selectIssueTestScreen(screenName: string) {
  await scrollToAndTap('root-screen-issue-tests', {
    scrollViewId: 'root-screen-examples-scrollview',
  });

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

/** Root → `section` list → `scenarioGroup` list → `screenKey`. */
async function selectTestsScreen(
  section: 'single-feature-tests' | 'component-integration-tests',
  scenarioGroup: string,
  screenKey: string,
) {
  const scenarioGroupId = scenarioGroup.replace(/\s/g, '');
  const sectionScrollView = `${section}-scrollview`;
  const groupScrollView = `${scenarioGroupId}-scenarios-scrollview`;

  await scrollToAndTap(`root-screen-${section}`, {
    scrollViewId: 'root-screen-examples-scrollview',
  });
  await waitFor(element(by.id(sectionScrollView)))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);

  await scrollToAndTap(`${section}-${scenarioGroupId}`, {
    scrollViewId: sectionScrollView,
  });
  await waitFor(element(by.id(groupScrollView)))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);

  await scrollToAndTap(screenKey, { scrollViewId: groupScrollView });
}

export const selectSingleFeatureTestsScreen = (
  scenarioGroup: string,
  screenKey: string,
) => selectTestsScreen('single-feature-tests', scenarioGroup, screenKey);

export const selectComponentIntegrationTestsScreen = (
  scenarioGroup: string,
  screenKey: string,
) => selectTestsScreen('component-integration-tests', scenarioGroup, screenKey);
