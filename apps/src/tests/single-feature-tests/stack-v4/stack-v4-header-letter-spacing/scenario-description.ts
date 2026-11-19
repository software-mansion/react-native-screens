import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Header Letter Spacing',
  key: 'stack-v4-header-letter-spacing',
  details:
    'Tests Stack v4 title, large title, back title and bar button item letter spacing: runtime changes, explicit 0 vs omitted, custom fonts, collapse and navigation.',
  platforms: ['ios', 'android'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.5', 'iOS 27.2'],
      testOn: ['iOS 18.6', 'iOS 26.5', 'iOS 27.2'],
    },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails:
    'The spacing changes are a few points wide and need screenshot comparison, which is not set up for this scenario yet.',
  smokeTest: false,
};
