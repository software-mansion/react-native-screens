import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item Icon',
  key: 'test-tabs-item-icon-ios',
  details:
    'Exercises iOS tab bar item icon props: icon, selectedIcon, host' +
    ' tabBarTintColor, and per-tab tabBarItemIconColor override.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
