import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split stack content swap',
  key: 'test-split-stack-content-swap-ios',
  details:
    'Content of a Split column swapped at runtime between a plain view and a Stack.Host.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
