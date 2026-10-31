import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Wrapped ScrollView',
  key: 'test-svm-wrapped-scroll-view',
  details:
    'ScrollViewMarker finds a ScrollView wrapped by single-child views: ' +
    "react-native-gesture-handler's ScrollView, or a plain View around a " +
    'ScrollView. The selector switches between the two.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
