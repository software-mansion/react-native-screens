import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Large Title Letter Spacing (iOS)',
  key: 'test-stack-large-title-letter-spacing-ios',
  details:
    'Tests legacy V4 large title tracking, runtime reset, scroll collapse, search bar integration and swipe-back handoff.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
