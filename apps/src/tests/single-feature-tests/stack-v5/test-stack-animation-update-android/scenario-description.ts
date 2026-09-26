import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Update (Android)',
  key: 'test-stack-animation-update-android',
  details:
    'Test changing the animation prop of a screen that is already on the ' +
    'stack: the new value drives the next pop of that screen, both on the top ' +
    'screen and on a covered one',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
