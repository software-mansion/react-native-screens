import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Sheet Select Detent',
  key: 'test-stack-v4-sheet-select-detent',
  details:
    "sheetRef.selectDetent: moving a presented form sheet between detents from JS with 0, 1 and 'last'.",
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.5'], testOn: ['iOS 26.5'] },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails: 'Planned, but will be implemented separately.',
  smokeTest: false,
};
