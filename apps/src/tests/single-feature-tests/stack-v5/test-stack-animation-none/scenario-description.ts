import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation None',
  key: 'test-stack-animation-none',
  details:
    'Test the none preset: screens and the header appear and disappear ' +
    'without motion or fading, and the back gesture still pops',
  platforms: ['android', 'ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
