import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Back Gesture',
  key: 'test-stack-back-gesture-ios',
  details:
    'Test backGestureEnabled and fullScreenBackGestureEnabled: a refused ' +
    'edge or content swipe leaves the screen in place, the back button still ' +
    'pops, and a nested stack with hidden headers pops one screen per swipe',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 27.2'],
      testOn: ['iOS 18.6', 'iOS 27.2'],
    },
  },
  deviceSetup: {
    iphone:
      "Run the screen directly: temporarily replace `apps/App.tsx` with `export { default } from './src/tests/single-feature-tests/stack-v5/test-stack-back-gesture-ios';` (inside the in-app menu, the menu's own stack pops on a refused swipe).",
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No step is automated. For manual testing perform all steps. The edge swipe is not available in Detox.',
  smokeTest: false,
};
