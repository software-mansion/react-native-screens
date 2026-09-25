import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Prominent Tab Screen Key',
  key: 'test-tabs-prominent-tab-screen-key-ios',
  details:
    'Validates the TabsHost prominentTabScreenKey prop, which makes an arbitrary tab prominent on iOS 27+.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
