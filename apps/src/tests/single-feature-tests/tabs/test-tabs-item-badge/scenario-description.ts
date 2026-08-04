import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item Badge',
  key: 'test-tabs-item-badge',
  details:
    'Exercises tab bar item badge props: badgeValue, tabBarItemBadgeBackgroundColor, and tabBarItemBadgeTextColor (Android only).',
  platforms: ['ios', 'android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
