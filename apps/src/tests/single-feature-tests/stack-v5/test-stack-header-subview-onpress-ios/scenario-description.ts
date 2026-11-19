import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Subview onPress (iOS)',
  key: 'test-stack-header-subview-onpress-ios',
  details:
    'Tests onPress on header items with a simple menu. Tap fires onPress toast, long-press shows menu.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.4'], testOn: ['iOS 18.6', 'iOS 26.4'] },
  },
  e2eCoverage: 'full',
  e2eCoverageDetails:
    'All steps covered, including the iOS 26 toolbar overflow ("More") menu. The overflow-menu assertions rely on the private `_UIContextMenuCell` / `_UIContextMenuCellContentView` classes and the `OverflowBarButtonItem` accessibility identifier, none of which are set by react-native-screens itself - they\'re UIKit implementation details of the new iOS 26 toolbar and could change in a future point release.',
  smokeTest: false,
};
