import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split stack column layout after collapse',
  key: 'test-split-stack-column-layout-after-collapse-ios',
  details:
    'A screen of a stack that navigates a column fills the window after the Split collapses.',
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
