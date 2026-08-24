import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import { IosElementAttributes } from 'detox/detox';
import {
  describeIfiOS26,
  getMatches,
  selectSingleFeatureTestsScreen,
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

async function frameX(matcher: {
  getAttributes: () => Promise<unknown>;
}): Promise<number> {
  const attrs = (await matcher.getAttributes()) as IosElementAttributes;
  return attrs.frame.x;
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
  for (let i = 1; i < xs.length; i++) {
    jestExpect(xs[i]).toBeGreaterThan(xs[i - 1]);
  }
}

// Asserts each symbol sits in its own liquid-glass platter, in the given
// left-to-right order.
async function expectItemsInOwnPlatters(sfSymbolNames: string[]) {
  const platters = sfSymbolNames.map(name =>
    by
      .type(CLASS_NAME_UI_NAVIGATION_BAR_PLATTER_VIEW)
      .withDescendant(by.id(name)),
  );
  for (const platter of platters) {
    jestExpect((await getMatches(platter)).length).toBe(1);
  }
  await expectOrderedLeftToRight(platters.map(platter => element(platter)));
}

async function toggleSwitch(testID: string, label: string, to: boolean) {
  await element(by.id(testID)).tap();
  await expect(element(by.id(testID))).toHaveLabel(`${label}: ${to}`);
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
      await toggleSwitch('toggle-custom-views', 'Custom views', true);
    });

    it('should show three custom-render trailing items on screen One, ordered alpha, bravo, charlie left to right', async () => {
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
      await toggleSwitch('toggle-separators', 'Separators', true);
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
