import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Item Appearance (iOS)',
  key: 'test-stack-header-item-appearance-ios',
  details:
    'Tests header item appearance: regular, disabled, prominent and prominent disabled items, moving items to the overflow menu, per-item tint color, and button / prominent button text attributes configured via header appearance.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
