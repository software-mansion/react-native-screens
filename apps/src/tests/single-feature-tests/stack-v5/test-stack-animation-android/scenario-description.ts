import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation (Android)',
  key: 'test-stack-animation-android',
  details:
    'Test how a stack transition runs with the default animation on Android: ' +
    'push, pop, the predictive back gesture, the draw order over a static ' +
    'screen and a nested container',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
