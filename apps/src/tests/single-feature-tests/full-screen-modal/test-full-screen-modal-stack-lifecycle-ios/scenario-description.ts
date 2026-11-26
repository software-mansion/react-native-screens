import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Full Screen Modal Stack Lifecycle',
  key: 'test-full-screen-modal-stack-lifecycle-ios',
  details:
    'Lifecycle events of the stack screens underneath FullScreenModalReplacingContent and FullScreenModalOverContent: single and nested stack, push and pop while a modal is open, and popping the screen that renders the modal.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 27.3'], testOn: ['iOS 27.3'] },
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
