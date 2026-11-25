import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Sheet orientation change',
  key: 'test-form-sheet-orientation-change',
  details:
    'Verifies that a presented FormSheet keeps correct size, position and content layout across device orientation changes.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'ipad', 'android-phone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.5'], testOn: ['iOS 26.5'] },
    ipad: { createdOn: ['iOS 26.5'], testOn: ['iOS 26.5'] },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  deviceSetup: {
    ipad: 'App in full-screen mode (regular width and regular height size classes).',
    'android-phone': 'Auto-rotate enabled.',
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails: 'Planned, but will be implemented separately.',
  smokeTest: false,
};
