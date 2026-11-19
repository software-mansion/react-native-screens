import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Initially Hidden',
  key: 'test-tabs-tab-bar-initially-hidden',
  details:
    'Verify that there is no hide animation when tab bar is initially hidden',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.2'],
      testOn: ['iOS 18.6', 'iOS 26.2'],
    },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails: 'Not covered at all.',
  smokeTest: false,
};
