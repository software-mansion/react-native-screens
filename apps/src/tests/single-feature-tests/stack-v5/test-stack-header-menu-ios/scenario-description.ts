import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Menu (iOS)',
  key: 'test-stack-header-menu-ios',
  details:
    'Tests header item menus and title menu: action items, toggle items, singleSelection, ' +
    'nested menus, and menu representation in the overflow menu.',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.4'], testOn: ['iOS 26.4'] },
    ipad: { createdOn: ['iPadOS 26.4'], testOn: ['iPadOS 26.4'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Covers all manual scenario steps except the Menu representation section. On iOS 27 the header item "Menu 1" is only checked to exist, not to be visible.',
  smokeTest: true,
};
