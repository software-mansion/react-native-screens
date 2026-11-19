import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Keyboard Integration',
  key: 'test-form-sheet-keyboard',
  details:
    'Text inputs inside sheets with 1, 2, 3 detents and fitToContents: keyboard show / hide, focused input visibility, dismissal with the keyboard shown.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.5'], testOn: ['iOS 26.5'] },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  deviceSetup: {
    iphone: 'On the simulator make sure the software keyboard is shown.',
    'android-phone': 'The emulator has to use the on-screen keyboard.',
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails: 'Planned, but will be implemented separately.',
  smokeTest: false,
};
