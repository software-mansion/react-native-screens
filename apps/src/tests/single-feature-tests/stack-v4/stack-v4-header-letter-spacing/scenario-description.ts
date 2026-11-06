import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Header Letter Spacing',
  key: 'stack-v4-header-letter-spacing',
  details:
    'Tests legacy V4 title, large title, back title and bar button item letter spacing, explicit 0 vs omitted, runtime reset, scroll collapse, search bar integration and swipe-back handoff.',
  platforms: ['ios', 'android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
