import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Header status bar scrim (Android)',
  key: 'test-stack-header-status-bar-scrim-android',
  details:
    'Verify header statusBarScrimColor customization and default scrims.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. Every assertion in this scenario is about rendered colors and animated transitions, neither of which Detox can read.',
  smokeTest: false,
};
