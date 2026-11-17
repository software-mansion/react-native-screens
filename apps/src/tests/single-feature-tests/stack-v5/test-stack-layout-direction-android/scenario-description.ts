import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Layout Direction',
  key: 'test-stack-layout-direction-android',
  details:
    'Test the direction prop on StackHost: the header title, subviews, menu ' +
    'and back button lay out against it, and push and pop transitions mirror',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
