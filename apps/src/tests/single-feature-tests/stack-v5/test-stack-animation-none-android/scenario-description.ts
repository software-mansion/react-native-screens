import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation None (Android)',
  key: 'test-stack-animation-none-android',
  details:
    'Test the none preset on Android: screens appear and disappear without ' +
    'motion or fading, and the predictive back gesture still pops',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
