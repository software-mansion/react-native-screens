import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Presentation state',
  key: 'test-form-sheet-presentation-state',
  details:
    'Verifies the presentation state machine when subjected to rapid consecutive open/close state changes from JS.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
