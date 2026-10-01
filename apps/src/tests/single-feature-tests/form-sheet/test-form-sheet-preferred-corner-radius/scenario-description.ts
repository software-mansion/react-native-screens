import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Corner Radius',
  key: 'test-form-sheet-preferred-corner-radius',
  details:
    'preferredCornerRadius: system default, sharp and custom radii, updated while presented.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
