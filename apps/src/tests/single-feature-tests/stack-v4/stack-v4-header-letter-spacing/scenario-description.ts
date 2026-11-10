import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Header Letter Spacing',
  key: 'stack-v4-header-letter-spacing',
  details:
    'Tests Stack v4 title, large title, back title and bar button item letter spacing: runtime changes, explicit 0 vs omitted, custom fonts, collapse and navigation.',
  platforms: ['ios', 'android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
