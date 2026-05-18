import type { ScenarioDescription } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'Prevent native dismiss - single stack',
  key: 'prevent-native-dismiss-single-stack',
  details:
    'Test prevent native dismiss behavior in simple single-stack scenario',
  platforms: ['android'],
  e2eCoverage: 'tbd',
};

export default scenarioDescription;
