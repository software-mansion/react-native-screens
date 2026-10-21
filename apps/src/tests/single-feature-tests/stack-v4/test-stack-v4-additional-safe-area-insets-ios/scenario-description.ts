import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Additional safe area insets',
  key: 'test-stack-v4-additional-safe-area-insets-ios',
  details:
    'Renders tab-like Screens in a ScreenContainer under a custom bar ' +
    'floating over their bottom edge. With additionalSafeAreaInsets set, ' +
    'the ScrollView content and the SafeAreaView keep clear of the bar.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
