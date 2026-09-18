import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Item Visibility Priority (iOS)',
  key: 'test-stack-header-item-visibility-priority-ios',
  details:
    'Three trailing items, the rightmost one grows when pressed. The button cycles that item visibilityPriority between the named values and a raw number.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
