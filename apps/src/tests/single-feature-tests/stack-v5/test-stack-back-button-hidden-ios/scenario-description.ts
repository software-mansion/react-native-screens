import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Back Button Hidden (iOS)',
  key: 'test-stack-back-button-hidden-ios',
  details:
    'Tests initial back-button visibility, live updates, prop removal, header config removal/remounting, and screen isolation.',
  platforms: ['ios'],
  e2eCoverage: 'full',
  smokeTest: false,
};
