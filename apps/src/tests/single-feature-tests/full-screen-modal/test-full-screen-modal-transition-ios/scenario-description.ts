import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Full Screen Modal Transition',
  key: 'test-full-screen-modal-transition-ios',
  details:
    'Every `transition` value of both FullScreenModal variants on open and close, and a change taking effect from the next open.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
