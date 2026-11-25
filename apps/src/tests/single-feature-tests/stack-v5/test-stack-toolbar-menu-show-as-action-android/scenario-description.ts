import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Menu Show As Action',
  key: 'test-stack-toolbar-menu-show-as-action-android',
  details: 'Tests the showAsAction prop on toolbar menu items.',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Automated: every step\'s placement (toolbar vs overflow menu), whether a toolbar item is icon-only or shows its title, the WITH_TEXT landscape layout via rotation, "Last clicked" after taps, and that overflow rows show no icon. For Props — ifRoom step 1 and Props — ifRoomWithText step 1, the number of promoted items is pinned to the reference emulator (API 36, portrait). Manual only: icon identity and tint (that the drawable is the search glyph); that the icon is still shown next to the text in landscape (Props — alwaysWithText step 2, Props — ifRoomWithText step 1); Props — ifRoom step 1 and Props — ifRoomWithText step 1 on other screen widths.',
  smokeTest: false,
};
