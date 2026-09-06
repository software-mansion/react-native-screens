import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item Icon',
  key: 'test-tabs-item-icon',
  details:
    'Exercises tab bar item icon props: iOS icon types (templateSource, sfSymbol,' +
    ' xcasset, imageSource) with tabBarItemIconColor overrides; Android' +
    ' tabBarItemIconColor in normal, selected and focused states.',
  platforms: ['ios', 'android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
