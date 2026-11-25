import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'SVM in Stack & Tabs - tabs special effects',
  key: 'test-stack-svm-tabs-special-effects',
  details:
    'Test whether special effects (on tab repetition) are performed correctly in nested container scenario ' +
    '(stack in tabs)',
  platforms: ['ios', 'android'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 26.5'],
      testOn: ['iOS 26.5'],
    },
    'android-phone': {
      createdOn: ['API Level 36'],
      testOn: ['API Level 36'],
    },
  },
  e2eCoverage: 'full',
  e2eCoverageDetails: 'All manual test steps covered.',
  smokeTest: false,
};
