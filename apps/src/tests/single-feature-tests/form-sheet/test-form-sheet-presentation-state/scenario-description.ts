import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Presentation State',
  key: 'test-form-sheet-presentation-state',
  details:
    'Rapid open/close toggles from JS: the presentation state machine must stay in sync.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
