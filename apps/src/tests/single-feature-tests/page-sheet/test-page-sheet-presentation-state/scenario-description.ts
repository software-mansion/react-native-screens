import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Presentation State',
  key: 'test-page-sheet-presentation-state',
  details:
    'Rapid open/close toggles from JS: the presentation state machine must stay in sync.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'ipad', 'android-phone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.1'], testOn: ['iOS 26.1'] },
    ipad: { createdOn: ['iOS 26.1'], testOn: ['iOS 26.1'] },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  deviceSetup: {
    ipad: 'App in full-screen mode (regular width and regular height size classes).',
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
