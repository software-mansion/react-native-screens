import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tabs Screen Orientation',
  key: 'test-tabs-screen-orientation',
  details: 'Test screen orientation behavior for TabsScreen',
  platforms: ['ios', 'android'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: { createdOn: [], testOn: [] },
    'android-phone': { createdOn: [], testOn: [] },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails:
    "Probably won't be implemented; this will be decided once the functionality works.",
  smokeTest: false,
};
