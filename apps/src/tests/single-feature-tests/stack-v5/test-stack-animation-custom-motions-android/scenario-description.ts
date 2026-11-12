import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Custom Motions (Android)',
  key: 'test-stack-animation-custom-motions-android',
  details:
    "Test an animation of Stack.Screen with a screen's motion written as tracks " +
    'on Android: translation, opacity, scale, rotation and a dim scrim, each ' +
    'track with its own duration and delay, omitted endpoints and the fallback ' +
    'to default for an invalid track',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
