import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Animation Presets Android',
  key: 'test-stack-animation-presets-android',
  details:
    'Tests the look of every animation preset, the dim scrim under predictive ' +
    'back and the RTL-aware default on Android',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
