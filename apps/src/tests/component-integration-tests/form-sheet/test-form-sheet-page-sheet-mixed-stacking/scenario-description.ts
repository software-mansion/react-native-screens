import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Mixed Stacking (PageSheet & FormSheet)',
  key: 'test-form-sheet-page-sheet-mixed-stacking',
  details:
    'PageSheet over FormSheet over PageSheet: dismissing the top, middle and bottom sheet of a mixed-style stack.',
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
