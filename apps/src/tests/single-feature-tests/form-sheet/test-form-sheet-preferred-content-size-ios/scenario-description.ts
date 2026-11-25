import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Preferred Content Size (iOS)',
  key: 'test-form-sheet-preferred-content-size-ios',
  details:
    'preferredContentSize sizes the iPad FormSheet panel; widthFollowsPreferredContentSizeWhenEdgeAttached applies its width to the edge-attached sheet.',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: { createdOn: ['iOS 27.3'], testOn: ['iOS 27.3'] },
    ipad: { createdOn: ['iOS 27.3'], testOn: ['iOS 27.3'] },
  },
  deviceSetup: {
    iphone: 'Rotation not locked.',
    ipad: 'App in full-screen mode (regular width and regular height size classes).',
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
