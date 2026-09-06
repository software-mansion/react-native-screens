import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Experimental UIStyle',
  key: 'test-tabs-tab-bar-experimental-user-interface-style-ios',
  details:
    'Test experimental_userInterfaceStyle prop on TabsScreen (iOS) - force light/dark interface style for the tab/navigation bar chrome',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
