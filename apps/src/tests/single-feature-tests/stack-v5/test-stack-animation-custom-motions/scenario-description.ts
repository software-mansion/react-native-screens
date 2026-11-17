import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Custom Motions',
  key: 'test-stack-animation-custom-motions',
  details:
    "Test an animation of Stack.Screen with a screen's motion written as tracks: " +
    'translation, opacity, scale, rotation and a dim scrim, each track with its ' +
    'own duration and delay, omitted endpoints and the fallback to default for ' +
    'an invalid track',
  platforms: ['android', 'ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
