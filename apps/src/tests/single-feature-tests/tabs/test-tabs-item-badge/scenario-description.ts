import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item Badge',
  key: 'test-tabs-item-badge',
  details:
    'Exercises tab bar item badge props: badgeValue, badgeBackgroundColor (iOS & Android), and badgeTextColor (Android only). ' +
    'Tests badge appearance across different layout modes (stacked, inline, compactInline) and states (normal, selected, focused, disabled).',
  platforms: ['ios', 'android'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
