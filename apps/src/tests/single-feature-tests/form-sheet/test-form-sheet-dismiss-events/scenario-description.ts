import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Dismiss Events',
  key: 'test-form-sheet-dismiss-events',
  details:
    'onDismiss vs onNativeDismiss: which event fires for JS and native dismissal.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'ipad', 'android-phone'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
