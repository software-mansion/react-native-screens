import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Hidden Pressable Interaction',
  key: 'test-tabs-tab-bar-hidden-pressable-interaction',
  details:
    'Test that content in the strip freed by a hidden tab bar receives touches.',
  platforms: ['android'],
  e2eCoverage: 'full',
  smokeTest: false,
};
