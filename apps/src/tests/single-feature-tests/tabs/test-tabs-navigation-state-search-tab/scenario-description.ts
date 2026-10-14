import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Navigation state on search tab interactions',
  key: 'test-tabs-navigation-state-search-tab',
  details:
    'Verifies that the navigation state progresses exactly once per user and programmatic selection of a search-role tab.',
  platforms: ['ios'],
  devices: ['iphone'],
  e2eCoverage: 'full',
  smokeTest: false,
};
