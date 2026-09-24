import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Sidebar Preferred Placement',
  key: 'test-tabs-tab-bar-sidebar-preferred-placement-ios',
  details:
    'Test sidebar vs tab bar preferred placement with Stack v5 header in tabs (iOS 27+).',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
