import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Subviews (Android)',
  key: 'test-stack-subviews-android',
  details: 'Tests header config and subview customization.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails:
    'The subview API is still subject to significant changes.',
  smokeTest: false,
};
