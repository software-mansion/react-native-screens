import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Menu (iOS)',
  key: 'test-stack-header-menu-ios',
  details:
    'Tests header item menus: action items, toggle items, singleSelection, and nested menus.',
  platforms: ['ios'],
  e2eCoverage: 'full',
  smokeTest: false,
};
