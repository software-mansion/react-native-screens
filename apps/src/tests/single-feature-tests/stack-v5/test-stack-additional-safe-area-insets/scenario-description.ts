import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Additional safe area insets',
  key: 'test-stack-additional-safe-area-insets',
  details:
    'Renders a Stack v5 screen with a header under a custom bar floating ' +
    'over its bottom edge. With additionalSafeAreaInsets set, the list, the ' +
    'SafeAreaView and useSafeAreaInsets keep clear of the bar.',
  platforms: ['ios', 'android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
