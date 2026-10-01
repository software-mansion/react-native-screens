import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Initially Hidden',
  key: 'test-tabs-tab-bar-initially-hidden',
  details: 'Verify that there is no hide animation when tab bar is initially hidden',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
