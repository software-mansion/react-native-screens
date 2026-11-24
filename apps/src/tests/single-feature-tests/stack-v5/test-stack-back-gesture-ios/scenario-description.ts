import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Back Gesture',
  key: 'test-stack-back-gesture-ios',
  details:
    'Test backGestureEnabled and fullScreenBackGestureEnabled: a refused ' +
    'edge or content swipe leaves the screen in place, the back button still ' +
    'pops, and a nested stack with hidden headers pops one screen per swipe',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
