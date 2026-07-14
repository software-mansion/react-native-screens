import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu Commands',
  key: 'test-stack-toolbar-menu-commands-android',
  details:
    'Tests toolbar menu items prop config and imperative commands. ' +
    'It focuses on the flow of updates rather than testing specific props ' +
    'but it covers the hidden prop.',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
