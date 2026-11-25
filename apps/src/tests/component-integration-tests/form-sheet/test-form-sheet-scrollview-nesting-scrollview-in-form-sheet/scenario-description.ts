import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'ScrollView In Sheet',
  key: 'test-form-sheet-scrollview-nesting-scrollview-in-form-sheet',
  details:
    'ScrollView inside a two-detent sheet: scrolling expands/collapses the sheet.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.5'],
      testOn: ['iOS 18.6', 'iOS 26.5'],
    },
    'android-phone': {
      createdOn: ['API Level 36'],
      testOn: ['API Level 36'],
    },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails: 'Planned, but will be implemented separately.',
  smokeTest: false,
};
