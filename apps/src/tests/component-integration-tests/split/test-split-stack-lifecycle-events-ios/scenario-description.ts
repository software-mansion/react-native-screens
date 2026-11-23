import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split stack lifecycle events',
  key: 'test-split-stack-lifecycle-events-ios',
  details:
    'Lifecycle events of a Split column navigated by a Stack.Host and of its screens.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
