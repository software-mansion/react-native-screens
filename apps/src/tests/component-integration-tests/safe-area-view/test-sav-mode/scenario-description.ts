import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'SafeAreaView mode: padding or margin',
  key: 'test-sav-mode',
  details:
    'A SafeAreaView on a Stack screen applies the insets as padding, keeping its frame and painting its background under the bars, or as margin, displacing a fixed-size child instead.',
  platforms: ['ios', 'android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
