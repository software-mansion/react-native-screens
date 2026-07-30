import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'SVM lift-on-scroll',
  key: 'test-stack-svm-lift-on-scroll',
  details:
    'Small Material 3 header with scroll flags + liftOnScroll whose content ' +
    'ScrollView is wrapped in a ScrollViewMarker. Verifies the header lifted ' +
    '(tonal/elevation) state stays stable — does not flash — while scrolling, ' +
    'because the marker lets the app bar resolve the correct scroll view.',
  platforms: ['android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
