import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Sheet Select Detent',
  key: 'test-stack-v4-sheet-select-detent',
  details:
    "sheetRef.selectDetent: moving a presented form sheet between detents from JS with 0, 1 and 'last'.",
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
