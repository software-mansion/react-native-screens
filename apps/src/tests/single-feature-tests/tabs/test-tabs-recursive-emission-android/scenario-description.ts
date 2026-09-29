import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Recursive emission on tab tap',
  key: 'test-tabs-recursive-emission-android',
  details:
    'Taps on tabs while JS keeps re-rendering the host and Reanimated has pending operations. Must not crash with "Recursive emission on TabsNavigationStateObserverRegistry".',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
