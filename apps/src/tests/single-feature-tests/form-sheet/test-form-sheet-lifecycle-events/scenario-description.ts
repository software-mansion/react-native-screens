import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Lifecycle Events',
  key: 'test-form-sheet-lifecycle-events',
  details:
    'Allows to test the lifecycle events (onWillAppear, onDidAppear, onWillDisappear, onDidDisappear) of the FormSheet component.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
