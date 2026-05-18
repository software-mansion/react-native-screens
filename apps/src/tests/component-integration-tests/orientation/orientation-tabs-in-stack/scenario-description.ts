import type { ScenarioDescription } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'TabsInStack',
  details:
    'Configuration in Tabs contained within StackScreen should have precedence over configuraton in Stack contained within TabScreen',
  key: 'cit-orientation-tabs-in-stack',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
};

export default scenarioDescription;
