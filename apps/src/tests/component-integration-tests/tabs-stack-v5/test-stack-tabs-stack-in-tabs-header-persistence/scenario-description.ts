import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack in Tabs - header persistence across tab switches',
  key: 'test-stack-tabs-stack-in-tabs-header-persistence',
  details:
    'Test that a Stack v5 header inside a tab survives switching tabs, ' +
    'and that changes made while the tab is away are applied when it returns',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': {
      createdOn: ['API Level 37'],
      testOn: ['API Level 37'],
    },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Check manually: step 1: the subtitle "Tab persistence" is shown; ' +
    'step 3: the subtitle "Tab persistence" is still shown; ' +
    'step 3: no flash of a re-built header when "Stack" comes back.',
  smokeTest: false,
};
