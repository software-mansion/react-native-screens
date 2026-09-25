import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Axis Behavior (iOS)',
  key: 'test-stack-header-axis-behavior-ios',
  details:
    'UIKit axis preferences for native and custom header items, including reset, removal and identifier-matched navigation. Requires iOS 27.1 and the iOS 27.1 SDK.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
