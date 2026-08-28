import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Lifecycle Events',
  key: 'test-form-sheet-lifecycle-events',
  details:
    'onWillAppear, onDidAppear, onWillDisappear, onDidDisappear: order on present and dismiss.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
