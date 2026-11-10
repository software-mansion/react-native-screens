import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split stack appearance events',
  key: 'test-split-stack-appearance-events-ios',
  details:
    'Appearance events of a Split column navigated by a Stack.Host and of its screens.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
