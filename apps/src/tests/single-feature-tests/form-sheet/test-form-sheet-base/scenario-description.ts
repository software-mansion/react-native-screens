import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Basic Functionality',
  key: 'test-form-sheet-base',
  details:
    'Single sheet with two detents: open, drag between detents, check content layout, dismiss.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
