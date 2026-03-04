import { ScenarioGroup } from '../../shared/helpers';

const scenarios = {};

const ScrollViewScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'ScrollView integration tests',
  details: 'Tests related to integration of our components with ScrollView',
  scenarios,
};

export default ScrollViewScenarioGroup;
