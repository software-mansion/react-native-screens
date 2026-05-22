import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Presentation State',
  key: 'test-form-sheet-presentation-state-ios',
  details:
    'Verifies the presentation state machine when subjected to rapid consecutive open/close state changes from JS.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
