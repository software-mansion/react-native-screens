import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Experimental UIStyle',
  key: 'test-tabs-tab-bar-experimental-user-interface-style-ios',
  details:
    'Test experimental_userInterfaceStyle prop on TabsScreen (iOS) - force light/dark interface style for the tab/navigation bar chrome',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.2'], testOn: ['iOS 26.2'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. Verification requires observing UI transitions (Tab Bar appearance and flicker detection) which are not reliably detectable by Detox snapshot or view-hierarchy testing.',
  smokeTest: false,
};
