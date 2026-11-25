import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tabs in Stack - stable enter transition',
  key: 'test-stack-tabs-tabs-in-stack-stable-enter-transition',
  details:
    'Pushing a stack screen that has a nested TabsContainer should play an enter transition without visual content jumps',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: [],
      testOn: [],
    },
    'android-phone': {
      createdOn: [],
      testOn: [],
    },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails: 'Planned, but will be implemented separately.',
  smokeTest: false,
};
