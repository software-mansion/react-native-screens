import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';

type Route = 'Home' | 'Search';
type ActionOrigin = 'user' | 'programmatic-js';

// Several round trips - a selection dropped or reported twice on any of them
// shows up as a provenance mismatch.
const SELECTION_ROUNDS = 5;

async function expectSelection(
  route: Route,
  actionOrigin: ActionOrigin,
  provenance: number,
) {
  await expect(element(by.id(`${route}-selected-in-js-label`))).toHaveLabel(
    'Selected in JS: yes',
  );
  await expect(element(by.id(`${route}-last-selection-label`))).toHaveLabel(
    `Last selection: ${route} (${actionOrigin}), provenance: ${provenance}`,
  );
}

describeIfiOS('Tabs: navigation state on search tab interactions', () => {
  // Every selection advances the provenance by exactly one - a dropped
  // selection leaves it behind, a duplicated one skips a value.
  let provenance = 0;

  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-navigation-state-search-tab',
    );
  });

  it('should start with the Home tab selected', async () => {
    await expectSelection('Home', 'programmatic-js', provenance);
  });

  it('should progress the state on every user selection of the search tab', async () => {
    for (let round = 0; round < SELECTION_ROUNDS; round++) {
      await element(by.id('search-tab-item')).tap();
      await expectSelection('Search', 'user', ++provenance);

      await element(by.id('home-tab-item')).tap();
      await expectSelection('Home', 'user', ++provenance);
    }
  });

  it('should progress the state once on programmatic selection of the search tab', async () => {
    await element(by.id('Home-select-search')).tap();
    await expectSelection('Search', 'programmatic-js', ++provenance);

    await element(by.id('Search-select-home')).tap();
    await expectSelection('Home', 'programmatic-js', ++provenance);
  });

  it('should progress the state on user selection after programmatic one', async () => {
    await element(by.id('Home-select-search')).tap();
    await expectSelection('Search', 'programmatic-js', ++provenance);

    await element(by.id('home-tab-item')).tap();
    await expectSelection('Home', 'user', ++provenance);

    await element(by.id('search-tab-item')).tap();
    await expectSelection('Search', 'user', ++provenance);
  });
});
