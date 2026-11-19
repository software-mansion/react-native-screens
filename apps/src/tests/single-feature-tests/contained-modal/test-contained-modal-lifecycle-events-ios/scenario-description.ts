import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Lifecycle Events',
  key: 'test-contained-modal-lifecycle-events-ios',
  details:
    'Lifecycle and rejection events of ContainedModalOverContent across presentation, dismissal, stack push/pop suspension, and a same-provider rejection.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.5'], testOn: ['iOS 26.5'] },
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
