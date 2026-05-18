import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Override ScrollView Content Inset',
  key: 'test-tabs-override-scroll-view-content-inset-ios',
  details:
    'Tests overrideScrollViewContentInsetAdjustmentBehavior with different static values per tab. ' +
    'False: content scrolls behind bars. True/Default: content is inset from bars.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
};
