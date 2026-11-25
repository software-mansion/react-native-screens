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
      createdOn: ['iOS 27.0'],
      testOn: ['iOS 27.0'],
    },
    'iphone-duo': {
      createdOn: ['iOS 27.1'],
      testOn: ['iOS 27.1'],
    },
  },
  deviceSetup: {
    ipad: 'App in full screen, portrait orientation at launch.',
    'iphone-duo':
      'Closed in portrait at launch. Postures: closed portrait and landscape, half-open, open portrait and landscape; unfold (closed → half-open → open) and close with the screen shown.',
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
