import type { ScenarioDescription } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'Basic functionality',
  key: 'test-svm-configures-scroll-view',
  details:
    'Allows to test the basic functionality of ScrollViewMarker component. ' +
    'It utilizes the StackContainer, to allow for observation of edge effects ' +
    'applied to the container edges. On Android this test serves only as a setup ' +
    'for native debugging.',
  platforms: ['ios', 'android'],
  e2eCoverage: 'tbd',
};

export default scenarioDescription;
