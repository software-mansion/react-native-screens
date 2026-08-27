import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Title Appearance (iOS)',
  key: 'test-stack-header-title-appearance-ios',
  details:
    'Tests title/large title/subtitle appearance via standardAppearance and scrollEdgeAppearance. Subtitle appearance applies to both regular and large subtitle as well.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
