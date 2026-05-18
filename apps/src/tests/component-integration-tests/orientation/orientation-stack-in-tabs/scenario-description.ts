import type { ScenarioDescription } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'StackInTabs',
  details:
    'Configuration in Stack contained within TabScreen always takes precedence',
  key: 'cit-orientation-stack-in-tabs',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
};

export default scenarioDescription;
