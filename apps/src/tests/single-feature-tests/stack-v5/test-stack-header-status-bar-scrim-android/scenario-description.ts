import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Header status bar scrim (Android)',
  key: 'test-stack-header-status-bar-scrim-android',
  details:
    'Verify header statusBarScrimColor customization and default scrims.',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
