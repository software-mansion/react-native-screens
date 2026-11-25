import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split stack contained modal target',
  key: 'test-split-stack-contained-modal-target-ios',
  details: 'Contained modals that target the stack of a Split column.',
  platforms: ['ios'],
  devices: ['ipad'],
  osVersions: {
    ipad: { createdOn: ['iOS 27.2'], testOn: ['iOS 27.2'] },
  },
  deviceSetup: {
    ipad: 'Portrait, full screen.',
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
