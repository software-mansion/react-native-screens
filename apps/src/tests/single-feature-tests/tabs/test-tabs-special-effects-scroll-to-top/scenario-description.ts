import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tabs special effect scroll to top',
  key: 'test-tabs-special-effects-scroll-to-top',
  details: 'Test settings of specialEffect scrollToTop.',
  platforms: ['ios', 'android'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.4', 'iOS 26.2'],
      testOn: ['iOS 18.4', 'iOS 26.2'],
    },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'full',
  smokeTest: false,
};
