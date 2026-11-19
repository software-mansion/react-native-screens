import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'SVM in Tabs - scroll edge effects',
  key: 'test-svm-tabs-scroll-edge-effects',
  details:
    'Test whether scroll edge effects are applied correctly when ScrollViewMarker ' +
    'is used inside Tabs',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 26.5'],
      testOn: ['iOS 26.5'],
    },
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
