import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Bar Minimization (iOS)',
  key: 'test-stack-header-bar-minimization-ios',
  details:
    'Tests header minimization configuration: minimizationBehavior and ' +
    'restorationBehavior. A single stack screen hosts a long scroll view with both ' +
    'pickers at its top.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
