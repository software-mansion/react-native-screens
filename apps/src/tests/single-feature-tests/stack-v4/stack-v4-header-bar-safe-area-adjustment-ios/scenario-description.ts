import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Header Bar Safe Area Adjustment (iOS)',
  key: 'stack-v4-header-bar-safe-area-adjustment-ios',
  details:
    'Tests the safeAreaAdjustment header config prop: whether the safe area ' +
    'adjusts while the navigation bar minimizes. The safe area is consumed ' +
    'by SafeAreaView.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
