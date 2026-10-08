import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'SafeAreaView below stack header (iOS)',
  key: 'test-sav-stack-sav-below-header-sav-in-stack-ios',
  details:
    'Tests SafeAreaView on a Stack v5 screen with a header. The SafeAreaView ' +
    'has a red border, which should start right below the header and ' +
    'end right above the home indicator.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
