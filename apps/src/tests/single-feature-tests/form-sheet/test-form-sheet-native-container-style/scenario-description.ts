import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Native container style',
  key: 'test-form-sheet-native-container-style-ios',
  details:
    'Allows to test the native container style properties (backgroundColor) of the FormSheet.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
