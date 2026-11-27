import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Background Effect (iOS)',
  key: 'test-form-sheet-background-effect-ios',
  details:
    'ios.backgroundEffect: automatic, none, color and blur materials, changed before and while presented.',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 26.5', 'iOS 27.0'],
      testOn: ['iOS 26.5', 'iOS 27.0'],
    },
    ipad: {
      createdOn: ['iOS 26.5', 'iOS 27.0'],
      testOn: ['iOS 26.5', 'iOS 27.0'],
    },
  },
  deviceSetup: {
    ipad: 'App in full-screen mode (regular width and regular height size classes).',
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
