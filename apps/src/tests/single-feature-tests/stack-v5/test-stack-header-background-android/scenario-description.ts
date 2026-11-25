import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Header background (Android)',
  key: 'test-stack-header-background-android',
  details:
    'Verify header backgroundColor and scrolledBackgroundColor customization.',
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
