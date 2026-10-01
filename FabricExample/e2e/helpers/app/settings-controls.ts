import { expect as jestExpect } from '@jest/globals';
import { device, expect, element, by, waitFor } from 'detox';
import {
  rewindAndScrollUntilVisible,
  scrollToAndTap,
  tapTopmost,
  type ScrollTargetOptions,
} from '@e2e/framework/gestures';
import { readTopmostText } from '@e2e/framework/matchers';
import { DEFAULT_TIMEOUT_MS } from '@e2e/framework/wait';

/** @see apps/src/shared/SettingsPicker.tsx — derives option `testID`s. */
export function pickerOptionId(pickerLabel: string, option: string): string {
  return `${pickerLabel.split(' ').join('-')}-${option}`.toLowerCase();
}

type PickerSelection = {
  pickerId: string;
  /** The picker's `label` prop — option `testID`s are derived from it. */
  label: string;
  option: string;
  /**
   * Address the last match — the topmost stacked screen's copy — for a picker
   * every screen of a stack renders. Taps in place, so `control` is ignored.
   */
  topmost?: boolean;
};

/**
 * Sets a picker to `option` and closes it (open option rows collide with the
 * `by.text` popup matchers). No-op when it already shows `option`. Omit
 * `control` for pickers outside a scroll view — they are tapped in place.
 */
export async function selectPickerOption(
  { pickerId, label, option, topmost = false }: PickerSelection,
  control?: ScrollTargetOptions,
) {
  const expected = `${label}: ${option}`;

  // Already set. Asserted collapsed: one left open by an earlier failure would
  // collide with later `by.text` matchers.
  if ((await readTopmostText(pickerId)) === expected) {
    await expect(element(by.id(pickerOptionId(label, option)))).not.toExist();
    return;
  }

  const tap = async (id: string) => {
    if (topmost) {
      await tapTopmost(by.id(id));
    } else if (control) {
      await scrollToAndTap(id, control);
    } else {
      await element(by.id(id)).tap();
    }
  };

  await tap(pickerId);
  await tap(pickerOptionId(label, option));
  await tap(pickerId);

  await expectPickerValue(pickerId, expected, topmost);
}

/** The value is an RN `Text`: `text` on Android, `label` on iOS. */
async function expectPickerValue(
  pickerId: string,
  expected: string,
  topmost: boolean,
) {
  if (topmost) {
    // A bare matcher would resolve to every stacked screen's copy.
    jestExpect(await readTopmostText(pickerId)).toBe(expected);
    return;
  }
  if (device.getPlatform() === 'ios') {
    await expect(element(by.id(pickerId))).toHaveLabel(expected);
  } else {
    await expect(element(by.id(pickerId))).toHaveText(expected);
  }
}

/** `to` is the state expected afterwards — a swallowed tap fails here, once
 * the wait below is exhausted. Omit `control` on screens whose switches sit
 * outside any scroll view. */
type SwitchToggle = {
  switchId: string;
  /** The switch's `label` prop. */
  label: string;
  /** The state expected after the tap. */
  to: boolean;
};

export async function toggleSettingsSwitch(
  { switchId, label, to }: SwitchToggle,
  control?: ScrollTargetOptions,
) {
  if (control) {
    const { scrollViewId, ...scroll } = control;
    await rewindAndScrollUntilVisible(switchId, scrollViewId, scroll);
  }
  await element(by.id(switchId)).tap();

  // Waited, not asserted once: the label is re-rendered from the switch's new
  // state, which Detox's idle sync does not always cover.
  await waitFor(element(by.text(`${label}: ${to}`)))
    .toBeVisible()
    .withTimeout(DEFAULT_TIMEOUT_MS);
}
