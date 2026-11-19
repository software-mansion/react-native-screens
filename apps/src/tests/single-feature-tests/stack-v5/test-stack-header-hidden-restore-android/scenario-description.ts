import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack header hidden restore',
  key: 'test-stack-header-hidden-restore-android',
  details:
    'Test that a header removed by hidden or by detaching headerConfig comes ' +
    'back fully collapsed over scrolled content and expanded otherwise',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails: 'Planned, will be implemented separately.',
  smokeTest: false,
};
