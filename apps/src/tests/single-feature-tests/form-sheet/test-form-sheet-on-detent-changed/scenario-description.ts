import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Detent Changed Event',
  key: 'test-form-sheet-on-detent-changed',
  details:
    'onDetentChanged: reported index after settling between three detents.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
