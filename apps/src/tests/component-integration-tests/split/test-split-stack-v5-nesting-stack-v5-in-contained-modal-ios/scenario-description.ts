import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack v5 in contained modal in Split',
  key: 'test-split-stack-v5-nesting-stack-v5-in-contained-modal-ios',
  details:
    'A stack rendered inside a contained modal in a Split column is an ordinary nested stack.',
  platforms: ['ios'],
  devices: ['ipad'],
  osVersions: {
    ipad: { createdOn: ['iOS 27.2'], testOn: ['iOS 27.2'] },
  },
  deviceSetup: {
    ipad: 'Full screen, so that both columns are visible.',
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
