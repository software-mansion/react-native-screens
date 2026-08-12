import { expect, element, by } from 'detox';
import {
  getTopmostMatch,
  rewindAndScrollUntilVisible,
  ScrollOptions,
} from '../e2e-utils';

/**
 * The `testID` `SettingsPicker` gives one of its option rows.
 *
 * This mirrors the expression in the component, so a picker's `label` prop and
 * its option ids stay in step. Hardcoding the derived id in a test instead
 * makes a later `label` rename fail at runtime with no compile error.
 *
 * @see apps/src/shared/SettingsPicker.tsx
 */
export function pickerOptionId(label: string, option: string): string {
  return `${label.split(' ').join('-')}-${option}`.toLowerCase();
}

/** Pass when the control or its rows can sit outside the viewport. */
export type SettingsControlOptions = ScrollOptions & { scrollViewId: string };

export type PickerSelection = {
  pickerId: string;
  /** The picker's `label` prop — its option `testID`s are derived from it. */
  label: string;
  option: string;
};

/**
 * Opens `pickerId`, taps `option`, closes the picker again, then asserts the
 * value it settled on — a swallowed tap fails here rather than as a puzzling
 * assertion further down the test.
 *
 * Closing matters: option rows stay in the hierarchy while a picker is open,
 * and their ids are derived from the label alone, so two pickers sharing a
 * label would expose the same option id twice. Keeping at most one picker open
 * is what makes those ids unambiguous.
 *
 * Returns early when the picker already shows `option`. The check reads the same
 * line the closing assertion checks, and `getAttributes` has no visibility
 * constraint, so an already-set picker costs one read and no gesture at all. It
 * assumes the picker is collapsed — true unless an earlier call threw partway,
 * which fails its own test first.
 */
export async function selectPickerOption(
  { pickerId, label, option }: PickerSelection,
  scroll?: SettingsControlOptions,
) {
  const expected = `${label}: ${option}`;

  if ((await getTopmostMatch(by.id(pickerId))).text === expected) {
    return;
  }

  const scrollToAndTap = async (id: string) => {
    if (scroll !== undefined) {
      const { scrollViewId, ...options } = scroll;
      await rewindAndScrollUntilVisible(id, scrollViewId, options);
    }
    await element(by.id(id)).tap();
  };

  await scrollToAndTap(pickerId);
  await scrollToAndTap(pickerOptionId(label, option));
  await scrollToAndTap(pickerId);

  await expect(element(by.id(pickerId))).toHaveText(expected);
}

/** `to` is the state expected afterwards — a swallowed tap fails here. */
export async function toggleSettingsSwitch(
  { switchId, label, to }: { switchId: string; label: string; to: boolean },
  { scrollViewId, ...scroll }: SettingsControlOptions,
) {
  await rewindAndScrollUntilVisible(switchId, scrollViewId, scroll);
  await element(by.id(switchId)).tap();

  await expect(element(by.text(`${label}: ${to}`))).toBeVisible();
}
