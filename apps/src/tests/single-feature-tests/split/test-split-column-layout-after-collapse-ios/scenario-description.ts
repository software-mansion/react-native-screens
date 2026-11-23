import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split column layout after collapse',
  key: 'test-split-column-layout-after-collapse-ios',
  details: 'A plain column shown after the Split collapses fills the window.',
  platforms: ['ios'],
  devices: ['ipad'],
  osVersions: {
    ipad: { createdOn: ['iOS 27.2'], testOn: ['iOS 27.2'] },
  },
  deviceSetup: {
    ipad: 'Portrait, in a multitasking mode that allows resizing the app window. The window has its full size at launch.',
  },
  e2eCoverage: 'tbd',
  smokeTest: false,
};
