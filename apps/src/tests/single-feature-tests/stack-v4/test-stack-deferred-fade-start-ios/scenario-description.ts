import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Deferred fade start',
  key: 'test-stack-deferred-fade-start-ios',
  details:
    'Hold a fade push while the destination prepares; release, timeout and unmount checks',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
