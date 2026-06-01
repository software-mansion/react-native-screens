import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Appearance',
  key: 'test-tabs-general-apperance-android',
  details: 'Tests Android tab bar appearance: tabBarItemLabelVisibilityMode, tabBarBackgroundColor, tabBarItemRippleColor, tabBarItemActiveIndicatorColor, and tabBarItemActiveIndicatorEnabled',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
