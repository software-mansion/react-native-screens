import type { ScenarioDescription } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'Prop: topColumnForCollapsing',
  key: 'test-split-top-column-for-collapsing',
  details: `
    Test the topColumnForCollapsing prop in Split component.
    Modification of this prop requires app restart.
  `,
  platforms: ['ios'],
  e2eCoverage: 'tbd',
};

export default scenarioDescription;
