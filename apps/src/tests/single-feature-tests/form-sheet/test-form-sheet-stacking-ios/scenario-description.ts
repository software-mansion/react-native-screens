import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stacking FormSheets',
  key: 'test-form-sheet-stacking-ios',
  details:
    'Allows testing of stacking multiple FormSheet components with different detents.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
