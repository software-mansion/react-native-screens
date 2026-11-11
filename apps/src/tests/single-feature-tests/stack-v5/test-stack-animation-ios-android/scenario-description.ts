import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Animation iOS Presets (Android)',
  key: 'test-stack-animation-ios-android',
  details:
    'Test the iOS presets on Android: the covered screen recedes and darkens ' +
    'behind the incoming one, no dim tint is left behind after a pop, a ' +
    'cancelled gesture or a committed one, and in RTL only the trailing and ' +
    'leading ones mirror',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
