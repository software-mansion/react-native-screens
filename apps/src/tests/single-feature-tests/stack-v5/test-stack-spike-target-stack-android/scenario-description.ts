import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'SPIKE: target stack requests (Android)',
  key: 'test-stack-spike-target-stack-android',
  details:
    'Throwaway prototype for labs #2127 / #2128: arbitrary target stacks applied as one FragmentManager batch, and cancelling a held predictive back gesture when a request is applied.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': {
      createdOn: ['API Level 34'],
      testOn: ['API Level 34', 'API Level 36', 'API Level 37'],
    },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails: 'Throwaway spike, never covered.',
  smokeTest: false,
};
