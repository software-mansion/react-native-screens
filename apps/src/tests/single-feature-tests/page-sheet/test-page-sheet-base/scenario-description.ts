import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Basic Functionality',
  key: 'test-page-sheet-base',
  details:
    'Single sheet with two detents: open, drag between detents, check content layout, dismiss.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'ipad', 'android-phone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.5'], testOn: ['iOS 26.5'] },
    ipad: { createdOn: ['iOS 26.5'], testOn: ['iOS 26.5'] },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  deviceSetup: {
    ipad: 'App in full-screen mode (regular width and regular height size classes).',
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
