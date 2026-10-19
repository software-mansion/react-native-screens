import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'SVM in Stack v4 - content scroll view',
  key: 'test-stack-v4-svm-content-scroll-view',
  details:
    'A ScrollViewMarker placed behind a background view registers its ' +
    'ScrollView as the content scroll view of the enclosing Stack v4 screen, ' +
    'so the large title collapses and the navigation bar edge effect tracks ' +
    'it. Covers a pushed screen and a formSheet with a header.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
