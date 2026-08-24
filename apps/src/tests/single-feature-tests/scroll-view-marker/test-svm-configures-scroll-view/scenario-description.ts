import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Basic functionality',
  key: 'test-svm-configures-scroll-view',
  details:
    'Allows to test the basic functionality of ScrollViewMarker component. ' +
    'It utilizes the StackContainer, to allow for observation of edge effects ' +
    'applied to the container edges. The top scroll edge effect can be ' +
    'switched at runtime with the on-screen selector. Scroll edge effects ' +
    'are supported on iOS 26+ only. On Android this test serves only as ' +
    'a setup for native debugging.',
  platforms: ['ios', 'android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
