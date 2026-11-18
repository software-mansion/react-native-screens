import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Placement',
  key: 'test-tabs-tab-bar-placement-ios',
  details: 'Test keeping the tab bar at the bottom on iPad.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated, the steps need an iPad in a regular width, rotation and window resizing.',
  smokeTest: false,
};
