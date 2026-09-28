import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack SafeAreaView (iOS)',
  key: 'test-stack-safe-area-view-ios',
  details:
    'Tests SafeAreaView on a Stack v5 screen with a header. At the top of the ' +
    'SafeAreaView there is a red rectangle with a green rectangle of the same ' +
    'size below it, at the bottom a blue one with a magenta one below it.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
