import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack in Tabs - header persistence across tab switches',
  key: 'test-stack-tabs-stack-in-tabs-header-persistence',
  details:
    'Test that a nested stack v5 header survives tab detach/reattach cycles',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
