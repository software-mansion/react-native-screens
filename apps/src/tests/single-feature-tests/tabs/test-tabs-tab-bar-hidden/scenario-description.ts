import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Hidden',
  key: 'test-tabs-tab-bar-hidden',
  details:
    'Test tabBarHidden prop on TabsHost - toggle to show/hide the tab bar at runtime',
  platforms: ['ios', 'android'],
  e2eCoverage: 'full',
  smokeTest: false,
};
