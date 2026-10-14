import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Fit To Contents',
  key: 'test-form-sheet-fit-to-contents',
  details:
    'detents="fitToContents": the sheet wraps its content and follows dynamic content height changes.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'ipad', 'android-phone'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
