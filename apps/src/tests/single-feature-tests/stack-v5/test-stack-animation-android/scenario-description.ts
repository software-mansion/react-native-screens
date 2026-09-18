import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Animation Android',
  key: 'test-stack-animation-android',
  details:
    'High contrast screens with per-screen animation pickers to test the slide presets, draw order and predictive back on Android',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
