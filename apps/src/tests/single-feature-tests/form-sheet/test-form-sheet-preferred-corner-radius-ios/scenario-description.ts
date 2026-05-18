import type { ScenarioDescription } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'Sheet preferred corner radius',
  key: 'test-form-sheet-preferred-corner-radius-ios',
  details:
    'Allows to test the preferredCornerRadius property of the FormSheet component.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};

export default scenarioDescription;
