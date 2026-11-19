import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Bottom Accessory Size',
  key: 'test-tabs-bottom-accessory-size-ios',
  details:
    'Test that the bottom accessory takes the full available width on iPad ' +
    'after the sidebar is toggled or the device is rotated, and on iPhone Duo ' +
    'after fold, rotation and tab bar minimize changes, also when the ' +
    'accessory is hidden or removed during the change.',
  platforms: ['ios'],
  devices: ['ipad', 'iphone-duo'],
  osVersions: {
    ipad: {
      createdOn: ['iPadOS 27.0'],
      testOn: ['iPadOS 27.0'],
    },
    'iphone-duo': {
      createdOn: ['iOS 27.1'],
      testOn: ['iOS 27.1'],
    },
  },
  deviceSetup: {
    ipad: 'App in full screen, portrait orientation at launch.',
    'iphone-duo': 'Closed and in portrait orientation at launch.',
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
