import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation iosFrom Presets',
  key: 'test-stack-animation-ios-from',
  details:
    'Test the iOS presets: the covered screen recedes and darkens behind the ' +
    'incoming one, no dim tint is left behind after a pop, and in RTL only ' +
    'the trailing and leading ones mirror',
  platforms: ['android', 'ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
