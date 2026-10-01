import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack SafeAreaView (iOS)',
  key: 'test-stack-safe-area-view-ios',
  details:
    'Tests SafeAreaView on a Stack v5 screen with a header. The SafeAreaView ' +
    'has a 6px red border, which should start right below the header and ' +
    'end right above the home indicator.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
