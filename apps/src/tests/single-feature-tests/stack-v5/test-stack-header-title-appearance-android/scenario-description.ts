import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Title Appearance (Android)',
  key: 'test-stack-header-title-appearance-android',
  details: 'Tests title/subtitle appearance.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails: 'Hard to verify text appearance with Detox.',
  smokeTest: false,
};
