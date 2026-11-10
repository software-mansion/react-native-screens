import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Edge Attached In Compact Height (iOS)',
  key: 'test-form-sheet-edge-attached-compact-height-ios',
  details:
    'prefersEdgeAttachedInCompactHeight, same for both styles (FormSheet and PageSheet): in iPhone landscape the sheet fills the screen when off and stays attached to the bottom edge when on, also when changed while presented.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
