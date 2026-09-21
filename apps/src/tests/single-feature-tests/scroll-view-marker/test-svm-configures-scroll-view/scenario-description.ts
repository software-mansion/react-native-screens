import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Basic functionality',
  key: 'test-svm-configures-scroll-view',
  details:
    'Allows to test the basic functionality of ScrollViewMarker component. ' +
    'It utilizes the StackContainer, to allow for observation of edge effects ' +
    'applied to the container edges. The top scroll edge effect can be ' +
    'switched at runtime with the on-screen selector.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
