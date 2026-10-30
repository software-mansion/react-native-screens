import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Preset Composition (Android)',
  key: 'test-stack-animation-preset-composition-android',
  details:
    'Test an animation of Stack.Screen composed from presets on Android: ' +
    'push and pop transitions named separately, per-screen motions with ' +
    'their options, omitted parts and the fallback to default for an invalid value',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
