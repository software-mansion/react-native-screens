import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar General Appearance',
  key: 'test-tabs-general-appearance-android',
  details:
    'Tests Android tab bar appearance: default system rendering, tab bar background color, label visibility, ripple effect, and active indicator.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': {
      createdOn: ['API Level 36'],
      testOn: ['API Level 36'],
    },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Covers only the tabBarItemLabelVisibilityMode verification (Label tab — tabBarItemLabelVisibilityMode steps 1-6). Label tab step 7, which involves cycling between modes, was omitted from having a dedicated test because the preceding test cases already cover tab switching and sufficiently validate this behavior. Other properties cannot be verified using Detox since it lacks access to color or visibility attributes on Android views, so it is not possible to programmatically assert whether a label is hidden or if a specific color value has been applied.',
  smokeTest: false,
};
