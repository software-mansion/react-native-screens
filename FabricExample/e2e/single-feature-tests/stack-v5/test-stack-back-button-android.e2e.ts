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

// Icon identity and tint colors are not assertable through Detox — see
// `scenario.md` next to the test screen for the manual-only steps.

// `<Button>` uppercases its title on Android.
const PUSH_SCREEN = 'PUSH SCREEN';
const PUSH_ANOTHER = 'PUSH ANOTHER';

const backButtonMatcher = by
  .type(CLASS_NAME_ANDROID_APP_COMPAT_IMAGE_BUTTON)
  .withAncestor(by.type(CLASS_NAME_ANDROID_MATERIAL_TOOLBAR));

// Multiple matches come back wrapped in `{ elements }`. Throws on no match —
// left uncaught so a crash is not misreported as "found 0".
async function countMatches(matcher: Detox.NativeMatcher): Promise<number> {
  const attrs = await element(matcher).getAttributes();
  return 'elements' in attrs ? attrs.elements.length : 1;
}

// Covered screens stay attached on Android, so every stacked screen's controls
// match at once; the topmost screen's copy is the last match.
async function tapTopmost(matcher: Detox.NativeMatcher): Promise<void> {
  const count = await countMatches(matcher);
  await element(matcher)
    .atIndex(count - 1)
    .tap();
}

// Controls have no testID, so they are addressed by their rendered
// `"<label>: <value>"` text.
async function selectOption(label: string, from: string, to: string) {
  await tapTopmost(by.text(`${label}: ${from}`));
  // `SettingsPicker` lowercases `<label>-<item>` (and dashes any spaces in the
  // label — no label here has one).
  await tapTopmost(by.id(`${label}-${to}`.toLowerCase()));
  // Closes the picker so its options do not push later controls off-screen.
  await tapTopmost(by.text(`${label}: ${to}`));
}

// A hidden navigation icon leaves the hierarchy, so "hidden" is "does not
// exist". The toolbar is asserted first, otherwise a header that never
// rendered would pass too. Each screen builds its own toolbar, hence the index.
async function expectNoBackButton() {
  const toolbarMatcher = by.type(CLASS_NAME_ANDROID_MATERIAL_TOOLBAR);
  const count = await countMatches(toolbarMatcher);
  await expect(element(toolbarMatcher).atIndex(count - 1)).toBeVisible();
  await expect(element(backButtonMatcher)).not.toExist();
}

// The icon can lag the pushed screen's content, so wait before counting — a
// settle race would otherwise read as "the back button is missing". The count
// names the ambiguity a second stacked toolbar's icon would cause.
async function expectSingleVisibleBackButton() {
  await waitFor(element(backButtonMatcher)).toBeVisible().withTimeout(3000);
  jestExpect(await countMatches(backButtonMatcher)).toBe(1);
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
