import type { ScenarioDescription } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'Split Color Scheme',
  key: 'test-split-color-scheme',
  details:
    'Tests how Split handles system, React Native and prop color scheme.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};

export default scenarioDescription;
