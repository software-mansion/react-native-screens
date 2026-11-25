import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Edge Attached In Compact Height (iOS)',
  key: 'test-page-sheet-edge-attached-compact-height-ios',
  details:
    'prefersEdgeAttachedInCompactHeight: in iPhone landscape the sheet fills the screen when off and stays attached to the bottom edge when on, also when changed while presented.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.1'], testOn: ['iOS 26.1'] },
  },
  deviceSetup: {
    iphone: 'Rotation not locked.',
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
