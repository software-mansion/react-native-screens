import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Item Visibility Priority (iOS)',
  key: 'test-stack-header-item-visibility-priority-ios',
  details:
    'Three trailing items, the rightmost one grows when pressed. Each button cycles the visibilityPriority of one item between the named values.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
