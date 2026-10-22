import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Native Container Style',
  key: 'test-form-sheet-native-container-style',
  details:
    'nativeContainerStyle.backgroundColor: native background fills the whole sheet, including safe areas.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
