import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Fit To Contents',
  key: 'test-page-sheet-fit-to-contents',
  details:
    'detents="fitToContents": the sheet wraps its content and follows dynamic content height and grabber visibility changes.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'ipad', 'android-phone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.1'], testOn: ['iOS 26.1'] },
    ipad: { createdOn: ['iPadOS 26.1'], testOn: ['iPadOS 26.1'] },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  deviceSetup: {
    ipad: 'App in full-screen mode (regular width and regular height size classes).',
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
