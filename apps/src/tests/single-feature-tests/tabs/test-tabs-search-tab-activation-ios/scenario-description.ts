import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Search Tab Activation',
  key: 'test-tabs-search-tab-activation-ios',
  details:
    'Validates automaticallyActivatesSearch on a searchRole tab with a search bar in the nested (legacy) stack header.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
