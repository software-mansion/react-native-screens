import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Sheet orientation change',
  key: 'test-form-sheet-orientation-change',
  details:
    'Verifies that a presented FormSheet keeps correct size, position and content layout across device orientation changes.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
