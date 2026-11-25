import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Dynamic Tab Count',
  key: 'test-tabs-dynamic-tab-count',
  details:
    'Test removing and re-adding TabsScreens at runtime (conditional rendering).',
  platforms: ['ios', 'android'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: { createdOn: ['iOS 27.2'], testOn: ['iOS 27.2'] },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails:
    'To be automated once adding tabs at runtime is fully supported on Android.',
  smokeTest: false,
};
