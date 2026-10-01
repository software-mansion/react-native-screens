import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Initial Detent Index',
  key: 'test-form-sheet-initial-detent-index',
  details:
    "initialDetentIndex: opening detent for 0, 1 and 'last'; re-renders must not snap the sheet back.",
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
