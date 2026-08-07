import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Item Identifier (iOS)',
  key: 'test-stack-header-item-identifier-ios',
  details:
    'Three screens each hold the same three header items (shared `identifier`) ' +
    'reordered across leading/trailing edges. On iOS 26+ matched items animate ' +
    'between positions instead of cross-fading. Not supported on iOS 18 and below.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
