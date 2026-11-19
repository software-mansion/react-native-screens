import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'IME insets',
  key: 'test-tabs-ime-insets-android',
  details:
    'Tests prop that determines whether BottomNavigationView respects IME insets.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': {
      createdOn: ['API Level 36'],
      testOn: ['API Level 36'],
    },
  },
  e2eCoverage: 'full',
  e2eCoverageDetails:
    'All manual steps are covered by an E2E test based on changes to the tab bar and text frame Y-positions.',
  smokeTest: false,
};
