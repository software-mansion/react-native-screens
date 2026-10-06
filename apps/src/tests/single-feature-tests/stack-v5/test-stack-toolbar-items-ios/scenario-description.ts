import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Toolbar Items (iOS)',
  key: 'test-stack-toolbar-items-ios',
  details:
    'Native bottom toolbar items, spacers, menus, removal, and screen ownership.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
