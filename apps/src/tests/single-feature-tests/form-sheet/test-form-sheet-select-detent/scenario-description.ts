import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Select Detent',
  key: 'test-form-sheet-select-detent',
  details:
    "selectDetent: moving an open sheet between detents from JS with 0, 1 and 'last'; calls on a closed sheet are ignored.",
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
