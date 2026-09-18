import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import { selectPickerOption } from '@e2e/app/settings-controls';
import { selectSingleFeatureTestsScreen } from '@e2e/app/test-screen-navigation';
import { expectTopmostVisible } from '@e2e/framework/assertions';
import { tapTopmost } from '@e2e/framework/gestures';
import { countMatches } from '@e2e/framework/matchers';
import { describeIfAndroid } from '@e2e/framework/platform';
import {
  stackV5BackButton,
  stackV5Toolbar,
} from '@e2e/framework/stack-header-android';

// Icon identity and tint colors are not assertable through Detox — see
// `scenario.md` next to the test screen for the manual-only steps.

// `<Button>` uppercases its title on Android.
const PUSH_SCREEN = 'PUSH SCREEN';
const PUSH_ANOTHER = 'PUSH ANOTHER';

const BACK_BUTTON_HIDDEN_SWITCH = 'back-button-hidden-switch';

// A hidden navigation icon leaves the hierarchy, so "hidden" is "does not
// exist". The toolbar is asserted first, otherwise a header that never
// rendered would pass too. Each screen builds its own toolbar, hence the index.
async function expectNoBackButton() {
  await expectTopmostVisible(stackV5Toolbar);
  await expect(element(stackV5BackButton())).not.toExist();
}

// The icon can lag the pushed screen's content, so wait before counting — a
// settle race would otherwise read as "the back button is missing". The count
// names the ambiguity a second stacked toolbar's icon would cause.
async function expectSingleVisibleBackButton() {
  await expectTopmostVisible(stackV5BackButton);
  jestExpect(await countMatches(stackV5BackButton())).toBe(1);
}

async function openScreen() {
  await device.reloadReactNative();
  await selectSingleFeatureTestsScreen(
    'Stackv5',
    'test-stack-back-button-android',
  );
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
    await tapTopmost(by.id(BACK_BUTTON_HIDDEN_SWITCH));
    await expectNoBackButton();

    await tapTopmost(by.id(BACK_BUTTON_HIDDEN_SWITCH));
    await expectSingleVisibleBackButton();
  });
});

describeIfAndroid('Stack v5: back button configured before the push', () => {
  beforeAll(openScreen);

  it('should keep the root screen back-button-free with an icon and tint set', async () => {
    await selectPickerOption({
      pickerId: 'icon-picker',
      label: 'icon',
      option: 'imageSource',
      topmost: true,
    });
    await selectPickerOption({
      pickerId: 'tint-color-normal-picker',
      label: 'tintColorNormal',
      option: 'purple',
      topmost: true,
    });
    await expectNoBackButton();
  });

  it('should render the back button once a screen is pushed', async () => {
    await pushScreen();
    await expectSingleVisibleBackButton();
  });
});
