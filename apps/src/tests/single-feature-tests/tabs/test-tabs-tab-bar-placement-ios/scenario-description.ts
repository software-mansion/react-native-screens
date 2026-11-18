import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Placement',
  key: 'test-tabs-tab-bar-placement-ios',
  details: 'Test keeping the tab bar at the bottom on iPad.',
  platforms: ['ios'],
  e2eCoverage: 'none',
  smokeTest: false,
};
