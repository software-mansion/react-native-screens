import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation Preset Composition',
  key: 'test-stack-animation-preset-composition',
  details:
    'Test an animation of Stack.Screen composed from presets: push and pop ' +
    'transitions named separately, per-screen motions with their options, ' +
    'omitted parts and the fallback to default for an invalid value',
  platforms: ['android', 'ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
