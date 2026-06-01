import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item System Item',
  key: 'test-tabs-system-item-ios',
  details:
    'Exercises the systemItem prop of TabsScreen on iOS. Demonstrates all 12 system item types ' +
    '(bookmarks, contacts, downloads, favorites, featured, history, more, mostRecent, mostViewed, ' +
    'recents, search, topRated) and shows how systemItem overrides custom title and icon.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
