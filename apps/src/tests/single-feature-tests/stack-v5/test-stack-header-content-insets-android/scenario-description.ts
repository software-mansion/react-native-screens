import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Header content insets (Android)',
  key: 'test-stack-header-content-insets-android',
  details: 'Verify contentInsetStart/contentInsetEnd on the Android header.',
  platforms: ['android'],
  devices: ['android-phone'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
