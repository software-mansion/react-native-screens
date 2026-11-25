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
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.5'], testOn: ['iOS 26.5'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. The core checks of this scenario are visual (blur, fade, and the dividing line of the scroll edge effects) and Detox cannot verify any of them.',
  smokeTest: false,
};
