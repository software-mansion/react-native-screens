import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Layout Direction',
  key: 'test-stack-layout-direction',
  details:
    'Test the direction prop on StackHost: the header and back button lay ' +
    'out against it and push and pop mirror on both platforms; on iOS ' +
    '`inherit` follows the system direction, not React Native',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
