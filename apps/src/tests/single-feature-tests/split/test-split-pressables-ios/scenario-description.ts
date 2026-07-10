import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split pressables',
  key: 'test-split-pressables-ios',
  details:
    'Allows to test pressability of components inside Split columns.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
