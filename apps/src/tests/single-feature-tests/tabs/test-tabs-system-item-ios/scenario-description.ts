import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar System Item',
  key: 'test-tabs-system-item-ios',
  details: 'Validates different configurations of the systemItem prop.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.5'],
      testOn: ['iOS 18.6', 'iOS 26.5'],
    },
  },
  deviceSetup: {
    iphone: 'Portrait orientation is the primary verification surface.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Automation covers all steps except Orientation smoke test, but not in full scope. A single suite runs on both iOS versions, with version-specific conditions where behavior diverges: the tab bar button class name resolves dynamically (UITabBarButton on iOS 18 and lower vs. _UITabButton on iOS 26), and the search item is asserted differently because it renders differently (visible label on iOS 18 vs. detached/no-label on iOS 26). The search item\'s position is asserted as detached on iOS 26 only; on iOS 18 and iOS 27 it keeps its position. Not automated: validating the differences between icon and selectedIcon; checking visual icon and label changes; the "hidden title" option is validated, but indirectly, so it should be verified manually; all steps of Orientation smoke test (orientation changes).',
  smokeTest: false,
};
