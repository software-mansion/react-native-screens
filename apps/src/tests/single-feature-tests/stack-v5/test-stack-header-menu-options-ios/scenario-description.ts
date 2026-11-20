import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Menu Options (iOS)',
  key: 'test-stack-header-menu-options-ios',
  details: 'Tests menu options in nested submenus.',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.4'], testOn: ['iOS 26.4'] },
    ipad: { createdOn: ['iOS 26.4'], testOn: ['iOS 26.4'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    "Every step of both sections is automated: menu contents at each toggle combination, collapsed-vs-inlined submenus via the presence of the disclosure chevron, and the palette's vertical list vs. horizontal icon row. Not covered: the menu separators; the exact top-to-bottom ordering of inlined items; on iOS 27, whether the Options and Palette header items are visible (they are only checked to exist, and are tapped by coordinates to open their menus).",
  smokeTest: false,
};
