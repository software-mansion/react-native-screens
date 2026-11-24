import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Pressable Under Back Swipe',
  key: 'test-stack-pressable-under-back-swipe-ios',
  details:
    'Test that a press under a back swipe ends when the swipe begins: ' +
    'dragging back and releasing fires no press, and presses work again ' +
    'afterwards',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
