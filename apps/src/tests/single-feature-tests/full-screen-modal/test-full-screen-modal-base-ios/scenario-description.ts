import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Full Screen Modal Base',
  key: 'test-full-screen-modal-base-ios',
  details:
    'Opening and closing both FullScreenModal variants, reopening during a dismissal, a content background, and the children state surviving a close.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 27.3'], testOn: ['iOS 27.3'] },
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
