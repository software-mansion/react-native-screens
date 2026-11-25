import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'ContainedModal stack provider',
  key: 'test-contained-modal-stack-provider-ios',
  details: 'Contained modals that target a stack as their provider.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 27.2'], testOn: ['iOS 27.2'] },
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
