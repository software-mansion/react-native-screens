import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Header Experimental UIStyle',
  key: 'stack-v4-header-experimental-user-interface-style-ios',
  details:
    'Tests experimental_userInterfaceStyle on the Stack v4 header on iPhone Duo: a screen that forces dark or light keeps its header items in that style in the vertical bar, and the next screen goes back to the system style.',
  platforms: ['ios'],
  devices: ['iphone-duo'],
  osVersions: {
    'iphone-duo': { createdOn: ['iOS 27.1'], testOn: ['iOS 27.1'] },
  },
  deviceSetup: {
    'iphone-duo':
      'Closed in portrait at launch. Postures: closed portrait (items in the vertical bar), open (items in the navigation bar); open and close with the forced dark screen shown.',
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails:
    'The result is the color of the header item glass, which needs screenshot comparison; not set up for this scenario yet. iPhone Duo is manual-only.',
  smokeTest: false,
};
