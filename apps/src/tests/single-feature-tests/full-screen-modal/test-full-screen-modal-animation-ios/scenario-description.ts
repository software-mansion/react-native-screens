import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Full Screen Modal Animation',
  key: 'test-full-screen-modal-animation-ios',
  details:
    'Every `animation` value of both FullScreenModal variants on open and close, and a change taking effect on the close of an open modal.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
