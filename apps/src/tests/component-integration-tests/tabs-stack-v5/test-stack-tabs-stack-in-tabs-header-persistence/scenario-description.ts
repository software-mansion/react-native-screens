import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack in Tabs - header persistence across tab switches',
  key: 'test-stack-tabs-stack-in-tabs-header-persistence',
  details:
    'Test that a Stack v5 header inside a tab survives switching tabs, ' +
    'and that changes made while the tab is away are applied when it returns',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
