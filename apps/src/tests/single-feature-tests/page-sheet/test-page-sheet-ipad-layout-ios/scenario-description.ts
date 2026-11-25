import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'iPad Layout (PageSheet vs FormSheet)',
  key: 'test-page-sheet-ipad-layout-ios',
  details:
    'PageSheet and FormSheet with the same props side by side: on iPad the page sheet is a wide bottom-anchored card, the form sheet a centered panel; on iPhone they are identical.',
  platforms: ['ios'],
  devices: ['ipad', 'iphone'],
  osVersions: {
    ipad: { createdOn: ['iOS 26.1'], testOn: ['iOS 26.1'] },
    iphone: { createdOn: ['iOS 26.1'], testOn: ['iOS 26.1'] },
  },
  deviceSetup: {
    ipad: 'App in full-screen mode (regular width and regular height size classes). Primary target of the scenario.',
    iphone: 'Parity check only.',
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
