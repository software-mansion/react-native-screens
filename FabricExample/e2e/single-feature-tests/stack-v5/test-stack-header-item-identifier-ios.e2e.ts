import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import { IosElementAttributes } from 'detox/detox';
import {
  describeIfiOS26,
  getMatches,
  selectSingleFeatureTestsScreen,
  toggleSettingsSwitch,
} from '../../e2e-utils';
import {
  CLASS_NAME_UI_LABEL,
  CLASS_NAME_UI_MODERN_BAR_BUTTON,
  CLASS_NAME_UI_NAVIGATION_BAR_PLATTER_VIEW,
} from '../../native-class-names';
import type { ItemId } from '@apps/tests/single-feature-tests/stack-v5/test-stack-header-item-identifier-ios';

// The icon of the header bar button item, addressed by its icon id (SF Symbol
// name or asset path).
function barButtonIcon(sfSymbolName: string) {
  return element(
    by.id(sfSymbolName).withAncestor(by.type(CLASS_NAME_UI_MODERN_BAR_BUTTON)),
  );
}

// A custom-rendered trailing header item, addressed by the `testID` added to
// its render output (`custom-item-<id>`).
function customItem(id: ItemId) {
  return element(by.id(`custom-item-${id}`));
}

async function waitForScreen(routeName: 'One' | 'Two' | 'Three') {
  await waitFor(element(by.type(CLASS_NAME_UI_LABEL).and(by.text(routeName))))
    .toExist()
    .withTimeout(3000);
}

async function pushNext() {
  await element(by.text('Next')).tap();
}

// Waits on the popped screen's title disappearing first: waiting only for the
// destination's title would pass early, since the back button already shows
// it. Once the popped title is gone, the destination title is unambiguous and
// is asserted to confirm where the pop landed.
async function popBackFrom(routeName: 'Two' | 'Three') {
  await element(by.text('Go back')).tap();
  await waitFor(element(by.type(CLASS_NAME_UI_LABEL).and(by.text(routeName))))
    .not.toExist()
    .withTimeout(3000);
  await waitForScreen(routeName === 'Three' ? 'Two' : 'One');
}

async function frameX(matcher: {
  getAttributes: () => Promise<unknown>;
}): Promise<number> {
  const attrs = (await matcher.getAttributes()) as IosElementAttributes;
  return attrs.frame.x;
}

function expectAscending(xs: number[]) {
  for (let i = 1; i < xs.length; i++) {
    jestExpect(xs[i]).toBeGreaterThan(xs[i - 1]);
  }
}

// Asserts `matchers` sit left-to-right in the given order, by comparing their
// horizontal position.
async function expectOrderedLeftToRight(
  matchers: { getAttributes: () => Promise<unknown> }[],
) {
  const xs: number[] = [];
  for (const matcher of matchers) {
    xs.push(await frameX(matcher));
  }
  expectAscending(xs);
}

// Asserts each symbol sits in its own liquid-glass platter, in the given
// left-to-right order.
async function expectItemsInOwnPlatters(sfSymbolNames: string[]) {
  const frames: IosElementAttributes['frame'][] = [];
  for (const name of sfSymbolNames) {
    const matches = (await getMatches(
      by
        .type(CLASS_NAME_UI_NAVIGATION_BAR_PLATTER_VIEW)
        .withDescendant(by.id(name)),
    )) as IosElementAttributes[];
    jestExpect(matches.length).toBe(1);
    frames.push(matches[0].frame);
  }
  // Each symbol's platter must be a different view: with separators off every
  // symbol resolves to the single shared platter, so its frame repeats here.
  const distinctFrames = new Set(
    frames.map(({ x, y, width, height }) => `${x},${y},${width},${height}`),
  );
  jestExpect(distinctFrames.size).toBe(sfSymbolNames.length);
  expectAscending(frames.map(frame => frame.x));
}

// The identifier-driven item-matching behavior under test only exists on
// iOS 26+ (see scenario.md, "OS test creation version").
describeIfiOS26('Stack Header Item Identifier (iOS)', () => {
  describe('sfSymbols with identifiers (default)', () => {
    beforeAll(async () => {
      await device.reloadReactNative();
      await selectSingleFeatureTestsScreen(
        'Stackv5',
        'test-stack-header-item-identifier-ios',
      );

      await waitForScreen('One');
    });

    it('should show three trailing items on screen One — 1.circle.fill, fish.fill, carrot.fill — ordered left to right', async () => {
      await expect(barButtonIcon('1.circle.fill')).toBeVisible();
      await expect(barButtonIcon('fish.fill')).toBeVisible();
      await expect(barButtonIcon('carrot.fill')).toBeVisible();

      await expectOrderedLeftToRight([
        barButtonIcon('1.circle.fill'),
        barButtonIcon('fish.fill'),
        barButtonIcon('carrot.fill'),
      ]);
    });

    it('should show the numbered item as 2.circle.fill in the center on screen Two, with the food items swapping symbols', async () => {
      await pushNext();
      await waitForScreen('Two');

      await expect(barButtonIcon('1.circle.fill')).not.toExist();
      await expect(barButtonIcon('2.circle.fill')).toBeVisible();
      await expect(barButtonIcon('birthday.cake.fill')).toBeVisible();
      await expect(barButtonIcon('fish.fill')).toBeVisible();

      await expectOrderedLeftToRight([
        barButtonIcon('birthday.cake.fill'),
        barButtonIcon('2.circle.fill'),
        barButtonIcon('fish.fill'),
      ]);
    });

    it('should show the numbered item as 3.circle.fill at the right edge on screen Three, with the food items swapping symbols again', async () => {
      await pushNext();
      await waitForScreen('Three');

      await expect(barButtonIcon('2.circle.fill')).not.toExist();
      await expect(barButtonIcon('3.circle.fill')).toBeVisible();
      await expect(barButtonIcon('carrot.fill')).toBeVisible();
      await expect(barButtonIcon('birthday.cake.fill')).toBeVisible();

      await expectOrderedLeftToRight([
        barButtonIcon('carrot.fill'),
        barButtonIcon('birthday.cake.fill'),
        barButtonIcon('3.circle.fill'),
      ]);
    });
  });

  describe('custom views with identifiers', () => {
    beforeAll(async () => {
      await device.reloadReactNative();
      await selectSingleFeatureTestsScreen(
        'Stackv5',
        'test-stack-header-item-identifier-ios',
      );
      await waitForScreen('One');
      // Scenario step 4: push through the stack with sfSymbol items first and
      // pop back to One, so the toggle swaps the item type on a header whose
      // native items are already materialized — not on a pristine screen.
      await pushNext();
      await waitForScreen('Two');
      await pushNext();
      await waitForScreen('Three');
      await popBackFrom('Three');
      await popBackFrom('Two');
      await toggleSettingsSwitch({
        switchId: 'toggle-custom-views',
        label: 'Custom views',
        to: true,
      });
    });

    it('should replace the sfSymbol items with three custom-render items on screen One, ordered alpha, bravo, charlie left to right', async () => {
      await expect(barButtonIcon('1.circle.fill')).not.toExist();
      await expect(customItem('alpha')).toBeVisible();
      await expect(customItem('bravo')).toBeVisible();
      await expect(customItem('charlie')).toBeVisible();

      await expectOrderedLeftToRight([
        customItem('alpha'),
        customItem('bravo'),
        customItem('charlie'),
      ]);
    });

    it('should reposition the alpha item to the center on screen Two, without dropping any item', async () => {
      await pushNext();
      await waitForScreen('Two');

      await expect(customItem('alpha')).toBeVisible();
      await expect(customItem('bravo')).toBeVisible();
      await expect(customItem('charlie')).toBeVisible();

      await expectOrderedLeftToRight([
        customItem('bravo'),
        customItem('alpha'),
        customItem('charlie'),
      ]);
    });

    it('should reposition the alpha item to the right edge on screen Three, without dropping any item', async () => {
      await pushNext();
      await waitForScreen('Three');

      await expect(customItem('alpha')).toBeVisible();
      await expect(customItem('bravo')).toBeVisible();
      await expect(customItem('charlie')).toBeVisible();

      await expectOrderedLeftToRight([
        customItem('bravo'),
        customItem('charlie'),
        customItem('alpha'),
      ]);
    });
  });

  describe('separators enabled', () => {
    beforeAll(async () => {
      await device.reloadReactNative();
      await selectSingleFeatureTestsScreen(
        'Stackv5',
        'test-stack-header-item-identifier-ios',
      );
      await waitForScreen('One');
      // Scenario step 6: push through the stack and pop back to One, so the
      // toggle splits already-materialized items into per-item platters — not
      // items configured with separators from birth.
      await pushNext();
      await waitForScreen('Two');
      await pushNext();
      await waitForScreen('Three');
      await popBackFrom('Three');
      await popBackFrom('Two');
      await toggleSettingsSwitch({
        switchId: 'toggle-separators',
        label: 'Separators',
        to: true,
      });
    });

    it('should give each of the three trailing items its own platter on screen One, ordered left to right', async () => {
      await expect(barButtonIcon('1.circle.fill')).toBeVisible();
      await expect(barButtonIcon('fish.fill')).toBeVisible();
      await expect(barButtonIcon('carrot.fill')).toBeVisible();

      await expectItemsInOwnPlatters([
        '1.circle.fill',
        'fish.fill',
        'carrot.fill',
      ]);
    });

    it('should keep one platter per item on screen Two, with the numbered item in the center one', async () => {
      await pushNext();
      await waitForScreen('Two');

      await expect(barButtonIcon('2.circle.fill')).toBeVisible();
      await expectItemsInOwnPlatters([
        'birthday.cake.fill',
        '2.circle.fill',
        'fish.fill',
      ]);
    });

    it('should keep one platter per item on screen Three, with the numbered item in the rightmost one', async () => {
      await pushNext();
      await waitForScreen('Three');

      await expect(barButtonIcon('3.circle.fill')).toBeVisible();
      await expectItemsInOwnPlatters([
        'carrot.fill',
        'birthday.cake.fill',
        '3.circle.fill',
      ]);
    });
  });
});
