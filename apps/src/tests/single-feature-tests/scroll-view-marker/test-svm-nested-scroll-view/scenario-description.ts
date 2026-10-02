import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Nested ScrollView',
  key: 'test-svm-nested-scroll-view',
  details:
    'Checks that ScrollViewMarker still resolves its ScrollView when the child ' +
    'renders it below its own container views, the way list and keyboard-aware ' +
    'wrapper components do. The top scroll edge effect can be switched at ' +
    'runtime with the on-screen selector; it should behave exactly as it does ' +
    'in the basic scenario, where the ScrollView is the direct child.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
