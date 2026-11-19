import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split column visibility',
  key: 'test-split-column-visibility-ios',
  details:
    'Native column visibility transitions and preferred display mode updates.',
  platforms: ['ios'],
  devices: ['ipad', 'iphone'],
  osVersions: {
    ipad: { createdOn: [], testOn: [] },
    iphone: { createdOn: [], testOn: [] },
  },
  deviceSetup: {
    ipad: 'Regular horizontal size class.',
    iphone: 'Compact width (iPhone or a compact window).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails: 'No Detox test exists for this scenario yet.',
  smokeTest: false,
};
