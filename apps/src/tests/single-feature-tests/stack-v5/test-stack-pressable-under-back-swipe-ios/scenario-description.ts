import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Pressable Under Back Swipe',
  key: 'test-stack-pressable-under-back-swipe-ios',
  details:
    'Test that a press under a back swipe ends when the swipe begins: ' +
    'dragging back and releasing fires no press, and presses work again ' +
    'afterwards',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 27.2'],
      testOn: ['iOS 18.6', 'iOS 27.2'],
    },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. The edge swipe is not available in Detox.',
  smokeTest: false,
};
