import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Full Screen Modal Stacking',
  key: 'test-full-screen-modal-stacking-ios',
  details:
    'A full-screen modal presented from inside another one, in every variant combination: presentation, restoring the lower modal, and dismissing the lower modal while the upper one is open.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
