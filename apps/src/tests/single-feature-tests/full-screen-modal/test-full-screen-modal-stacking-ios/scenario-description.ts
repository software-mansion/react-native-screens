import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Full Screen Modal Stacking',
  key: 'test-full-screen-modal-stacking-ios',
  details:
    'A full-screen modal presented from inside another one, in every variant combination: presentation, restoring the lower modal, and dismissing the lower modal while the upper one is open.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 27.3'], testOn: ['iOS 27.3'] },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails:
    'The event log is readable with Detox; automation is planned together with the other full-screen modal scenarios.',
  smokeTest: false,
};
