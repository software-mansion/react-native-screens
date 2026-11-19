import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Layout Direction',
  key: 'test-stack-layout-direction-android',
  details:
    'Test the direction prop on StackHost: the header title, subviews, menu ' +
    'and back button lay out against it, and push and pop transitions mirror',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails:
    'The probe and title bounds are readable with Detox, the back arrow mirroring and the transition direction are not; not implemented yet.',
  smokeTest: false,
};
