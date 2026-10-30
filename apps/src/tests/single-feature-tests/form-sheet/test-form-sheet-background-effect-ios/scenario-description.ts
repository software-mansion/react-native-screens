import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Background Effect (iOS)',
  key: 'test-form-sheet-background-effect-ios',
  details:
    'backgroundEffect: automatic, none, color and blur materials, changed before and while presented.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
