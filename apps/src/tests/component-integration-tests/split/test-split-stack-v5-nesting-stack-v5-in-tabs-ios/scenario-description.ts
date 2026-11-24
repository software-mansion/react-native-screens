import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack v5 in Tabs in Split',
  key: 'test-split-stack-v5-nesting-stack-v5-in-tabs-ios',
  details:
    'A stack rendered inside Tabs in a Split column is an ordinary nested stack.',
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
