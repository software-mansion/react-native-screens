import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Scroll edge effects after screen re-attach',
  key: 'test-svm-screen-reattach-scroll-edge-effects',
  details:
    'JS bottom tabs (ScreenContainer), each with a Stack v4 and a transparent ' +
    'header. A soft top edge effect set by ScrollViewMarker or by the stack ' +
    'screen stays soft on first render and after switching tabs. A screen ' +
    'left at automatic does not inherit the effect of a popped screen.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
