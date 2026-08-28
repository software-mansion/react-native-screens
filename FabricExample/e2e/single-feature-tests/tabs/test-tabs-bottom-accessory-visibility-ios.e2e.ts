import { device, expect, element, by, waitFor } from 'detox';
import {
  describeIfiOS26,
  expectBottomAccessoryAboveTabBar,
  selectSingleFeatureTestsScreen,
  toggleSettingsSwitch,
} from '../../e2e-utils';
import { CLASS_NAME_RNS_TABS_BOTTOM_ACCESSORY } from '../../native-class-names';

/**
 * Covers the end state of each `scenario.md` step: after every `hidden` /
 * `rendered` toggle the accessory is either shown with its content above the
 * tab bar, or gone. Animation quality stays manual.
 */

const SCROLL_VIEW = 'bottom-accessory-visibility-scrollview';
const RENDERED_SWITCH = 'rendered-switch';
const HIDDEN_SWITCH = 'hidden-switch';
const ACCESSORY_TEXT = 'bottom-accessory-text';
const ACCESSORY_CONTENT = 'Bottom Accessory';

// Grace period for the animated `setBottomAccessory:` attach / detach.
const TRANSITION_TIMEOUT_MS = 3000;

const SETTINGS_CONTROL = { scrollViewId: SCROLL_VIEW };

const bottomAccessory = by.type(CLASS_NAME_RNS_TABS_BOTTOM_ACCESSORY);

// The text resolves twice under the same `testID`.
const bottomAccessoryText = () =>
  element(by.id(ACCESSORY_TEXT).withAncestor(bottomAccessory)).atIndex(0);

const setHidden = (to: boolean) =>
  toggleSettingsSwitch(
    { switchId: HIDDEN_SWITCH, label: 'hidden', to },
    SETTINGS_CONTROL,
  );

const setRendered = (to: boolean) =>
  toggleSettingsSwitch(
    { switchId: RENDERED_SWITCH, label: 'rendered', to },
    SETTINGS_CONTROL,
  );

async function expectSwitchState(
  switchId: string,
  label: string,
  value: boolean,
) {
  await expect(element(by.id(switchId))).toHaveLabel(`${label}: ${value}`);
}

async function expectBottomAccessoryShown() {
  await waitFor(element(bottomAccessory))
    .toExist()
    .withTimeout(TRANSITION_TIMEOUT_MS);
  await expect(element(bottomAccessory)).toBeVisible();
  await expect(bottomAccessoryText()).toExist();
  await expect(bottomAccessoryText()).toHaveText(ACCESSORY_CONTENT);

  await expectBottomAccessoryAboveTabBar();
}

async function expectBottomAccessoryAbsent() {
  await waitFor(element(bottomAccessory))
    .not.toExist()
    .withTimeout(TRANSITION_TIMEOUT_MS);
  await expect(element(by.id(ACCESSORY_TEXT))).not.toExist();
}

describeIfiOS26('Tabs: bottomAccessoryHidden (iOS 26+)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-bottom-accessory-visibility-ios',
    );
  });

  it('should show the bottom accessory above the tab bar on load', async () => {
    await expectSwitchState(RENDERED_SWITCH, 'rendered', true);
    await expectSwitchState(HIDDEN_SWITCH, 'hidden', false);

    await expectBottomAccessoryShown();
  });

  it('should remove the bottom accessory when hidden is toggled on', async () => {
    await setHidden(true);

    await expectBottomAccessoryAbsent();
  });

  it('should bring the bottom accessory back with its content when hidden is toggled off', async () => {
    await setHidden(false);

    await expectBottomAccessoryShown();
  });

  it('should remove the bottom accessory when rendered is toggled off', async () => {
    await setRendered(false);

    await expectBottomAccessoryAbsent();
  });

  it('should bring the bottom accessory back with its content when rendered is toggled on', async () => {
    await setRendered(true);

    await expectBottomAccessoryShown();
  });

  it('should keep the bottom accessory absent when hidden is toggled on and then rendered off', async () => {
    await setHidden(true);
    await expectBottomAccessoryAbsent();

    await setRendered(false);

    await expectBottomAccessoryAbsent();
  });

  it('should keep the bottom accessory absent when rendered is toggled on while still hidden', async () => {
    await expectSwitchState(HIDDEN_SWITCH, 'hidden', true);
    await setRendered(true);

    await expectBottomAccessoryAbsent();
  });

  it('should show the bottom accessory with its content when hidden is toggled off', async () => {
    await expectSwitchState(RENDERED_SWITCH, 'rendered', true);
    await setHidden(false);

    await expectBottomAccessoryShown();
  });
});
