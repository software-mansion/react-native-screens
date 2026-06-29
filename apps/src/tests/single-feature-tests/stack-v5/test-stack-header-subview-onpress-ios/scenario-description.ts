import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Subview onPress (iOS)',
  key: 'test-stack-header-subview-onpress-ios',
  details:
    'Tests onPress on header items with a simple menu. Tap fires onPress toast, long-press shows menu.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
