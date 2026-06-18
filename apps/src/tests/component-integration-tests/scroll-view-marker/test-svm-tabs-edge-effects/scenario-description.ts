import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Integration: SVM in Tabs - edge effects',
  key: 'test-svm-tabs-edge-effects',
  details:
    'Test whether scroll edge effects are applied correctly when ScrollViewMarker ' +
    'is used inside Tabs',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
