import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split stack only child rule',
  key: 'test-split-stack-only-child-rule-ios',
  details:
    'A Stack.Host that is not the direct and only child of a Split.Column.',
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
