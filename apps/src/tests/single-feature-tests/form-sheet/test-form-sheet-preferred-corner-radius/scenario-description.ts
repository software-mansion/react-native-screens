import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Corner Radius',
  key: 'test-form-sheet-preferred-corner-radius',
  details:
    'preferredCornerRadius: system default, sharp and custom radii, updated while presented.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'ipad', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.5'],
      testOn: ['iOS 18.6', 'iOS 26.5'],
    },
    ipad: { createdOn: ['iOS 26.5'], testOn: ['iOS 26.5'] },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  deviceSetup: {
    ipad: 'App in full-screen mode (regular width and regular height size classes).',
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails: 'Planned, but will be implemented separately.',
  smokeTest: false,
};
