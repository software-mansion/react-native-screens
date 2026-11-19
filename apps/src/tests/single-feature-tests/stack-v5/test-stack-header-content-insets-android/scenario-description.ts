import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Header content insets (Android)',
  key: 'test-stack-header-content-insets-android',
  details: 'Verify contentInsetStart/contentInsetEnd on the Android header.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails:
    'Automation is possible for most of the scenario but is not implemented yet.',
  smokeTest: false,
};
