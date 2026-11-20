import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Item Appearance (iOS)',
  key: 'test-stack-header-item-appearance-ios',
  details:
    'Tests header item appearance: regular, disabled, prominent and prominent disabled items, moving items to the overflow menu, item tint color, and button / prominent button / back button text attributes configured via header appearance.',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.5'], testOn: ['iOS 26.5'] },
    ipad: { createdOn: ['iOS 26.5'], testOn: ['iOS 26.5'] },
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
