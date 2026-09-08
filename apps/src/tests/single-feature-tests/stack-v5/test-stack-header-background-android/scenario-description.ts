import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Header background (Android)',
  key: 'test-stack-header-background-android',
  details:
    'Verify header backgroundColor and scrolledBackgroundColor customization.',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
