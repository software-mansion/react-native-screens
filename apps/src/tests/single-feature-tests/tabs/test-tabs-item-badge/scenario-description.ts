import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item Badge',
  key: 'test-tabs-item-badge',
  details:
    'Exercises tab bar item badge props: badgeValue, tabBarItemBadgeBackgroundColor, and tabBarItemBadgeTextColor (Android only).',
  platforms: ['ios', 'android'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.5', 'iOS 27.0'],
      testOn: ['iOS 18.6', 'iOS 26.5'],
    },
    'android-phone': {
      createdOn: ['API Level 36'],
      testOn: ['API Level 36'],
    },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Only Baseline step 1 on iOS is automated: the E2E test asserts the badge text values for all four tabs. Below iOS 27 the badge view is nested in its tab bar item and its text is checked there; the badge view class name resolves per version (_UIBadgeView on iOS 18 and lower, _UIBarBadgeView on iOS 26). From iOS 27 the badge is detached from the item, so a separate suite checks the badge in the item accessibility value and the text of the badge view label. Not covered: all Android steps and the remaining iOS steps; badge background and text colors, because Detox does not expose color attributes of native tab bar badge views and screenshot diffs are not implemented yet.',
  smokeTest: false,
};
