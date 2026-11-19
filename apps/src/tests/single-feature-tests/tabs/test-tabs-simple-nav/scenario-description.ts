import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Test simple navigation',
  key: 'test-tabs-simple-nav',
  details: 'Test basic navigation scenarios',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.5'],
      testOn: ['iOS 18.6', 'iOS 26.5'],
    },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'The E2E test covers all steps except step 1 of Rapid programmatic switching (edge case), which is omitted because Detox automatically waits for the UI layer to become idle. Due to this synchronization model, it cannot execute rapid tab switching sequentially before the previous transition animation finishes.',
  smokeTest: true,
};
