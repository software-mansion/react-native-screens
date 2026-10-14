import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Fractional Detents',
  key: 'test-form-sheet-fractional-detents',
  details: 'testing different setups for one, two and three fractional detents',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'ipad', 'android-phone'],
  e2eCoverage: 'tbd',
  smokeTest: true,
};
