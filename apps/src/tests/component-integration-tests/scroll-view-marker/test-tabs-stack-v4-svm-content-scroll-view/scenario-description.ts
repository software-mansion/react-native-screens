import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'SVM in Tabs & Stack v4 - content scroll view',
  key: 'test-tabs-stack-v4-svm-content-scroll-view',
  details:
    'A ScrollViewMarker placed behind a background view in a Stack v4 ' +
    'screen nested in Tabs. The marked ScrollView drives the large title, ' +
    'the tab bar minimize behavior, scroll-to-top on tab reselection and ' +
    'the content inset adjustment override.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
