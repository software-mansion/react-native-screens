import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Full Screen Modal Animation',
  key: 'test-full-screen-modal-animation-ios',
  details:
    'Every `animation` value of both FullScreenModal variants on open and close, and a change taking effect on the close of an open modal.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 27.3'], testOn: ['iOS 27.3'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'No steps are automated. Animations are not assertable with Detox.',
  smokeTest: false,
};
