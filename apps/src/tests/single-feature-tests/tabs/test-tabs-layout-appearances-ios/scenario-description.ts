import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Layout Appearances (iOS)',
  key: 'test-tabs-layout-appearances-ios',
  details:
    'Verifies tab item font styles and colors across all layout appearances. Visual changes are used to confirm responsive layout shifts during device rotation.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.5'],
      testOn: ['iOS 18.6', 'iOS 26.5'],
    },
  },
  deviceSetup: {
    iphone:
      'Portrait on any iPhone for stacked; landscape on an iPhone Pro (non-Max) for compactInline; landscape on an iPhone Pro Max for inline (iOS 18 and lower only; on iOS 26 it also uses compactInline).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'All verifiable outcomes are visual — font style (italic vs. normal) and font color of native tab bar item labels. Detox does not expose typographic attributes or color values of native UITabBarItem title labels, making automated assertion infeasible. Manual verification on a physical or simulated device is required for all steps.',
  smokeTest: false,
};
