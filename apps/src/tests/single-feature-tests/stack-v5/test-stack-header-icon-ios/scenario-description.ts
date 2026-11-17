import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Icon (iOS)',
  key: 'test-stack-header-icon-ios',
  details:
    'Tests header item icons: SF Symbol, xcasset, imageSource, templateSource on bar button items and menu items, with runtime updates.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
