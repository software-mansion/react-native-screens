import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar General Appearance No Liquid Glass',
  key: 'test-tabs-general-appearance-no-liquid-glass-ios',
  details:
    'Exercises per-tab tab bar appearance props via both standardAppearance and scrollEdgeAppearance: tabBarBackgroundColor, tabBarBlurEffect, tabBarShadowColor.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6'],
      testOn: ['iOS 18.6'],
    },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. All observable outcomes are purely visual - background color, shadow color, and blur effect on the native tab bar. These cannot be reliably detected by Detox view-hierarchy or snapshot testing.',
  smokeTest: false,
};
