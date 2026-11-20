import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Placement',
  key: 'test-tabs-tab-bar-placement-ios',
  details: 'Test keeping the tab bar at the bottom on iPad.',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: { createdOn: ['iOS 27.2'], testOn: ['iOS 18.6', 'iOS 27.2'] },
    ipad: {
      createdOn: ['iOS 26.2', 'iOS 27.2'],
      testOn: ['iOS 18.6', 'iOS 26.2', 'iOS 27.2'],
    },
  },
  deviceSetup: {
    ipad: 'Full screen window in portrait at launch.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. The iPad steps need a regular width, rotation and window resizing.',
  smokeTest: false,
};
