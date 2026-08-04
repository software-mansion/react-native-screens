import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Sheet preferred corner radius',
  key: 'test-form-sheet-preferred-corner-radius',
  details:
    'Allows to test the preferredCornerRadius property of the FormSheet component.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
