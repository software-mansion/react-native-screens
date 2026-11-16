import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Preset Options',
  key: 'test-stack-animation-options',
  details:
    'Test the duration, easing and distance options of an animation preset ' +
    'and the fallback to default for an invalid value',
  platforms: ['android', 'ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
