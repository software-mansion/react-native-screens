import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stacked Sheets',
  key: 'test-form-sheet-stacking',
  details:
    'Three sheets presented on top of each other: dismissing the top, middle and bottom sheet.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
