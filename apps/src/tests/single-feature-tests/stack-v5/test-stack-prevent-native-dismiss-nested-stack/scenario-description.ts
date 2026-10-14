import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Prevent native dismiss - nested stack',
  key: 'test-stack-prevent-native-dismiss-nested-stack',
  details:
    'Observe behavior of prevent native dismiss depending on configuration of nested stack hosting screen',
  platforms: ['android'],
  devices: ['android-phone'],
  e2eCoverage: 'incomplete',
  smokeTest: true,
};
