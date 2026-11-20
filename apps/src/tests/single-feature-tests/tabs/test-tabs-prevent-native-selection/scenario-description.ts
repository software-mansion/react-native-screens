import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Prevent native selection',
  key: 'test-tabs-prevent-native-selection',
  details: 'Test preventNativeSelection prop on TabsScreen',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'ipad', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.2'],
      testOn: ['iOS 18.6', 'iOS 26.2'],
    },
    ipad: {
      createdOn: ['iOS 18.6', 'iOS 26.2'],
      testOn: ['iOS 18.6', 'iOS 26.2'],
    },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'The E2E test covers most steps for iPhone and Android phone. The iPad E2E test covers all steps of Baseline, Enabling preventNativeSelection and Disabling preventNativeSelection, steps 1-4 of Multiple tabs, and additionally verifies that all six tabs exist in the sidebar. Not covered: iPad specific steps, as the resize interactions required to trigger the More tab (Split View / window resizing between compact and regular size classes) are not feasible with Detox, and selecting a tab from the sidebar is not possible with Detox; repeated selection of an already active More tab (step 7 of iOS only - More navigation controller (for iPad resize app)), because when the More tab content is already active and displayed, Detox cannot re-select the More tab bar item as it becomes invisible for Detox. Temporarily disabled: on iPad, iOS 26+, the tests covering steps 2-11 are skipped (see #4778), because tabBarItemTestID is not applied to tab bar items on iPad, so the tab items cannot be matched by id (labs#1886). Until the issue is fixed, the iPad E2E test covers only step 1 and the sidebar check - verify steps 2-11 on iPad manually.',
  smokeTest: true,
};
