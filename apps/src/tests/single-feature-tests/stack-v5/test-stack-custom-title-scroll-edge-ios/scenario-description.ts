import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Custom Title Scroll Edge (iOS)',
  key: 'test-stack-custom-title-scroll-edge-ios',
  details:
    'Compares automatic scroll-edge protection for native and React titles, including changes to custom title bounds and children.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
