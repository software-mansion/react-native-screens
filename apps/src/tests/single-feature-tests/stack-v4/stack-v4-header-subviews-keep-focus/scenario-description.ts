import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Header Subviews Keep Focus',
  key: 'stack-v4-header-subviews-keep-focus',
  details:
    'Tests that a focused TextInput in a header subview (title, left or right) keeps focus when other parts of the header update.',
  platforms: ['ios', 'android'],
  e2eCoverage: 'full',
  smokeTest: false,
};
