import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item Icon, Asset Catalog Light/Dark Variants',
  key: 'test-tabs-item-icon-asset-catalog-variants-ios',
  details:
    'Checks that an asset-catalog image used as a tab icon ({ uri }) keeps its' +
    ' dark variant: the light and dark variants of the image set are clearly' +
    ' different, and the TabsHost color scheme can be switched at runtime.',
  platforms: ['ios'],
  devices: ['iphone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.4'], testOn: ['iOS 26.4'] },
  },
  deviceSetup: {
    iphone:
      'System appearance set to Light before the first step (Cmd+Shift+A toggles it in the simulator), so that `colorScheme: inherit` starts from a known state. FabricExample rebuilt after adding the `variant-icon` image set (asset catalog change).',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated: the observable outcome is the rendered color of a native tab bar item icon, which Detox does not expose.',
  smokeTest: false,
};
