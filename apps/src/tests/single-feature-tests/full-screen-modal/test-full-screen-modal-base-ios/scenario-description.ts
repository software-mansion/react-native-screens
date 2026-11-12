import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Full Screen Modal Base',
  key: 'test-full-screen-modal-base-ios',
  details:
    'Opening and closing both FullScreenModal variants, reopening during a dismissal, a custom background, and the children state surviving a close.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
