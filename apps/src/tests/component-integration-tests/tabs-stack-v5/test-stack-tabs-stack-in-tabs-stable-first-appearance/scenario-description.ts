import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack in Tabs - stable first appearance',
  key: 'test-stack-tabs-stack-in-tabs-stable-first-appearance',
  details:
    'Selecting a tab that hosts a StackContainer for the first time should show the stack screen content laid out below the header right away, without visual content jumps',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: [],
      testOn: [],
    },
    'android-phone': {
      createdOn: ['API Level 36'],
      testOn: ['API Level 36'],
    },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. The content jump lasts one or two frames and the E2E test cannot observe single frames.',
  smokeTest: false,
};
