import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import {
  describeIfAndroid,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON,
  CLASS_NAME_ANDROID_MATERIAL_TOOLBAR,
} from '../../native-class-names';

/**
 * Covers `backButtonHidden`, and the root screen staying back-button-free once
 * an icon and tint are configured. Icon identity and tint colors are not
 * assertable through Detox on Android — see `scenario.md` next to the test
 * screen.
 */

// `<Button>` uppercases its title on Android.
const PUSH_SCREEN = 'PUSH SCREEN';
const PUSH_ANOTHER = 'PUSH ANOTHER';

const backButtonMatcher = by
  .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON)
  .withAncestor(by.type(CLASS_NAME_ANDROID_MATERIAL_TOOLBAR));

// `getAttributes()` wraps multiple matches in `{ elements }` and throws on
// none. The catch cannot tell "no match" from a crashed app, so a zero is only
// used to pick an index or compare counts, never to assert absence.
async function countMatches(matcher: Detox.NativeMatcher): Promise<number> {
  try {
    const attrs = await element(matcher).getAttributes();
    return 'elements' in attrs ? attrs.elements.length : 1;
  } catch {
    return 0;
  }
}

// Android keeps covered screens attached, so every stacked screen's controls
// match at once; the topmost screen's copy is the last match.
async function tapTopmost(matcher: Detox.NativeMatcher): Promise<void> {
  const count = await countMatches(matcher);
  await element(matcher)
    .atIndex(Math.max(count - 1, 0))
    .tap();
}

// Controls have no testID, so they are addressed by their rendered
// `"<label>: <value>"` text. The picker is closed again afterwards so its
// expanded options never push later controls out of the viewport.
async function selectOption(label: string, from: string, to: string) {
  await tapTopmost(by.text(`${label}: ${from}`));
  // `SettingsPicker` derives option testIDs as `<label>-<item>`, lowercased.
  await tapTopmost(by.id(`${label}-${to}`.toLowerCase()));
  await tapTopmost(by.text(`${label}: ${to}`));
}

// `Toolbar` removes the navigation icon from the hierarchy when it is set to
// `null`, so "hidden" is "does not exist" rather than "exists but invisible".
async function expectNoBackButton() {
  await expect(element(backButtonMatcher)).not.toExist();
}

// The count states "exactly one" — a stacked screen's toolbar contributing a
// second icon would otherwise surface as an opaque Espresso ambiguity error.
async function expectSingleVisibleBackButton() {
  jestExpect(await countMatches(backButtonMatcher)).toBe(1);
  await expect(element(backButtonMatcher)).toBeVisible();
}

async function openScreen() {
  await device.reloadReactNative();
  await selectSingleFeatureTestsScreen('Stackv5', 'test-stack-back-button');
  await waitFor(element(by.text(PUSH_SCREEN)))
    .toBeVisible()
    .withTimeout(3000);
}

async function pushScreen() {
  await tapTopmost(by.text(PUSH_SCREEN));
  await waitFor(element(by.text(PUSH_ANOTHER)))
    .toBeVisible()
    .withTimeout(3000);
}

describeIfAndroid('Stack v5: back button', () => {
  beforeAll(openScreen);

  it('should not render a back button on the stack root screen', async () => {
    await expectNoBackButton();
  });

  it('should render a back button on a pushed screen', async () => {
    await pushScreen();
    await expectSingleVisibleBackButton();
  });

  it('should remove and restore the back button with backButtonHidden', async () => {
    await tapTopmost(by.text('backButtonHidden: false'));
    await expectNoBackButton();

    await tapTopmost(by.text('backButtonHidden: true'));
    await expectSingleVisibleBackButton();
  });
});

describeIfAndroid('Stack v5: back button configured before the push', () => {
  beforeAll(openScreen);

  it('should keep the root screen back-button-free with an icon and tint set', async () => {
    await selectOption('icon', 'default', 'imageSource');
    await selectOption('tintColorNormal', 'default', 'purple');
    await expectNoBackButton();
  });

  it('should render the back button once a screen is pushed', async () => {
    await pushScreen();
    await expectSingleVisibleBackButton();
  });
});
