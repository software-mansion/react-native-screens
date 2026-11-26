import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Screen Animation',
  key: 'test-tabs-screen-animation-ios',
  details:
    'Test animation prop on TabsScreen (iOS) - disable the system tab switch transition for transparent tab screens over a shared background',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.5'], testOn: ['iOS 18.6', 'iOS 26.5'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. Verification requires observing the tab switch transition, which is not reliably detectable by Detox snapshot or view-hierarchy testing.',
  smokeTest: false,
};
