import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tabs in Stack - stable enter transition',
  key: 'test-stack-tabs-tabs-in-stack-stable-enter-transition',
  details:
    'Pushing a stack screen that has a nested TabsContainer should play an enter transition without visual content jumps',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
