import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import { IosElementAttributes } from 'detox/detox';
import {
  barButtonIcon,
  describeIfiOS26,
  getMatches,
  selectSingleFeatureTestsScreen,
  toggleSettingsSwitch,
} from '../../e2e-utils';
import {
  CLASS_NAME_UI_LABEL,
  CLASS_NAME_UI_NAVIGATION_BAR_PLATTER_VIEW,
} from '../../native-class-names';

// Every SF Symbol the test screen cycles through (SYMBOL_CYCLES in the test
// screen's index.tsx).
const ALL_SYMBOLS = [
  '1.circle.fill',
  '2.circle.fill',
  '3.circle.fill',
  'fish.fill',
  'carrot.fill',
  'birthday.cake.fill',
];

// Asserts the bar shows exactly the `expected` symbols: each expected symbol
// is visible and every other known symbol is absent, so a stale item left
// over from the previous screen fails the test. A duplicated symbol also
// fails, since `toBeVisible` rejects multiple matches.
async function expectExactBarButtonSymbols(expected: string[]) {
  for (const name of ALL_SYMBOLS) {
    if (expected.includes(name)) {
      await expect(barButtonIcon(name)).toBeVisible();
    } else {
      await expect(barButtonIcon(name)).not.toExist();
    }
  }
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
      await expectExactBarButtonSymbols([
        '1.circle.fill',
        'fish.fill',
        'carrot.fill',
      ]);

      await expectOrderedLeftToRight([
        barButtonIcon('1.circle.fill'),
        barButtonIcon('fish.fill'),
        barButtonIcon('carrot.fill'),
      ]);
    });

    it('should show the numbered item as 2.circle.fill in the center on screen Two, with the food items swapping symbols', async () => {
      await pushNext();
      await waitForScreen('Two');

      await expectExactBarButtonSymbols([
        '2.circle.fill',
        'birthday.cake.fill',
        'fish.fill',
      ]);

      await expectOrderedLeftToRight([
        barButtonIcon('birthday.cake.fill'),
        barButtonIcon('2.circle.fill'),
        barButtonIcon('fish.fill'),
      ]);
    });

    it('should show the numbered item as 3.circle.fill at the right edge on screen Three, with the food items swapping symbols again', async () => {
      await pushNext();
      await waitForScreen('Three');

      await expectExactBarButtonSymbols([
        '3.circle.fill',
        'carrot.fill',
        'birthday.cake.fill',
      ]);

      await expectOrderedLeftToRight([
        barButtonIcon('carrot.fill'),
        barButtonIcon('birthday.cake.fill'),
        barButtonIcon('3.circle.fill'),
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
      await expectExactBarButtonSymbols([
        '1.circle.fill',
        'fish.fill',
        'carrot.fill',
      ]);

      await expectItemsInOwnPlatters([
        '1.circle.fill',
        'fish.fill',
        'carrot.fill',
      ]);
    });

    it('should keep one platter per item on screen Two, with the numbered item in the center one', async () => {
      await pushNext();
      await waitForScreen('Two');

      await expectExactBarButtonSymbols([
        '2.circle.fill',
        'birthday.cake.fill',
        'fish.fill',
      ]);
      await expectItemsInOwnPlatters([
        'birthday.cake.fill',
        '2.circle.fill',
        'fish.fill',
      ]);
    });

    it('should keep one platter per item on screen Three, with the numbered item in the rightmost one', async () => {
      await pushNext();
      await waitForScreen('Three');

      await expectExactBarButtonSymbols([
        '3.circle.fill',
        'carrot.fill',
        'birthday.cake.fill',
      ]);
      await expectItemsInOwnPlatters([
        'carrot.fill',
        'birthday.cake.fill',
        '3.circle.fill',
      ]);
    });
  });
});
