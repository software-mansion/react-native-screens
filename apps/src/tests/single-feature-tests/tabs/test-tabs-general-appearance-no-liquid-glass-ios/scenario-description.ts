import type { ScenarioDescription } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar General Appearance No Liquid Glass',
  key: 'test-tabs-general-appearance-no-liquid-glass-ios',
  details:
    'Exercises per-tab tab bar appearance props via both standardAppearance and scrollEdgeAppearance: tabBarBackgroundColor, tabBarBlurEffect, tabBarShadowColor.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};

export default scenarioDescription;
