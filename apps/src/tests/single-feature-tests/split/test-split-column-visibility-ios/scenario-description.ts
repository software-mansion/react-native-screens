import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split column visibility',
  key: 'test-split-column-visibility-ios',
  details:
    'Native column visibility transitions and preferred display mode updates.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
