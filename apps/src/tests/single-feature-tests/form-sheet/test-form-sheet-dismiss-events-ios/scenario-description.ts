import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Dismiss Events',
  key: 'test-form-sheet-dismiss-events-ios',
  details:
    'Allows to test the dismiss events (onDismiss, onNativeDismiss) of the FormSheet component.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
