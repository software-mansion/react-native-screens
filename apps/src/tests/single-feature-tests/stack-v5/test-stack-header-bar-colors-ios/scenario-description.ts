import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Bar Colors (iOS)',
  key: 'test-stack-header-bar-colors-ios',
  details:
    'Tests independent standard and scroll-edge background and shadow colors, dynamic colors and resets.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
