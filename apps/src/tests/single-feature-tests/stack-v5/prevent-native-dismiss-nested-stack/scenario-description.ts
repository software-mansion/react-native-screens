import type { ScenarioDescription } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'Prevent native dismiss - nested stack',
  key: 'prevent-native-dismiss-nested-stack',
  details:
    'Observe behavior of prevent native dismiss depending on configuration of nested stack hosting screen',
  platforms: ['android'],
  e2eCoverage: 'tbd',
};

export default scenarioDescription;
