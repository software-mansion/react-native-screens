import { device, expect, element, by, waitFor } from 'detox';
import { describeIfiOS, selectSingleFeatureTestsScreen } from '../../e2e-utils';
import {
  CLASS_NAME_UI_BUTTON_BAR_BUTTON,
  CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW,
} from '../../native-class-names';

/** Highest number of toasts expected to be stacked at once in this suite. */
const MAX_STACKED_TOASTS = 3;

/**
 * Dismisses a toast by its message, tolerating the `<n>. ` index prefix that
 * `ToastProvider` prepends (see `apps/src/shared/Toast.tsx`). A single
 * interaction here can emit two toasts at once - the item's `onPress` and the
 * menu's `onSelectionChange` - and their relative order is a native-dispatch
 * detail, so the numeric prefix each toast ends up with is not guaranteed.
 * Probing the mounted prefixes keeps the assertion independent of that order,
 * unlike matching a hard-coded `1. ` prefix.
 */
async function dismissToastByMessage(message: string) {
  for (let index = 1; index <= MAX_STACKED_TOASTS; index++) {
    const label = `${index}. ${message}`;
    await waitFor(element(by.label(label)))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.label(label)).tap();
    return;
  }
  throw new Error(`Toast not found for message: "${message}"`);
}

function textItem(label: string) {
  return element(by.type(CLASS_NAME_UI_BUTTON_BAR_BUTTON).and(by.label(label)));
}

/** A checked toggle/singleSelection row inside the presented native UIMenu. */
function checkmarkFor(itemLabel: string) {
  return element(
    by
      .id('checkmark')
      .withAncestor(
        by
          .type(CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW)
          .and(by.label(itemLabel)),
      ),
  );
}

// `SettingsPicker` derives its option testIDs from the label only, not the item
// index (`title-foo`, `menu-single`, …), so those IDs are duplicated across
// item sections. They resolve unambiguously only because each helper opens a
// single picker, taps the option, and closes it again before the next call -
// i.e. at most one picker is expanded at any time. Keep that invariant.
async function setTitle(itemIndex: number, variant: 'foo' | 'bar') {
  const pickerId = `title-picker-${itemIndex}`;
  await element(by.id(pickerId)).tap();
  await element(by.id(`title-${variant}`)).tap();
  await element(by.id(pickerId)).tap();
}

async function setMenuMode(
  itemIndex: number,
  mode: 'none' | 'single' | 'multi',
) {
  const pickerId = `menu-picker-${itemIndex}`;
  await element(by.id(pickerId)).tap();
  await element(by.id(`menu-${mode}`)).tap();
  await element(by.id(pickerId)).tap();
}

describeIfiOS('Stack Header Selective Updates (iOS)', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-header-selective-updates-ios',
    );
  });

  it('should display both trailing items with their initial titles', async () => {
    await expect(textItem('Foo 1')).toBeVisible();
    await expect(textItem('Foo 2')).toBeVisible();
  });

  it("should update only Item 1's header title when its Title picker changes to bar, leaving Item 2 untouched", async () => {
    await setTitle(0, 'bar');

    await expect(textItem('Bar 1')).toBeVisible();
    await expect(textItem('Foo 1')).not.toExist();
    await expect(textItem('Foo 2')).toBeVisible();
  });

  it('should attach a native menu to Item 1 when its Menu picker changes to single', async () => {
    await setMenuMode(0, 'single');

    await expect(element(by.id('menu-picker-0'))).toHaveLabel('Menu: single');
  });

  describe('opening Item 1 menu by long press with singleSelection', () => {
    it('should select Option-0-B via the menu and emit the selection toast', async () => {
      await textItem('Bar 1').longPress();
      await expect(checkmarkFor('Option-0-A')).toBeVisible();

      await element(by.text('Option-0-B')).tap();
      await dismissToastByMessage('Pressed Item 1');
      await dismissToastByMessage('Item 1 [single]: "Option-0-B"');
    });

    it('should show only Option-0-B checked when the menu is reopened', async () => {
      await textItem('Bar 1').longPress();

      await expect(checkmarkFor('Option-0-B')).toBeVisible();
      await expect(checkmarkFor('Option-0-A')).not.toExist();
      await dismissToastByMessage('Pressed Item 1');
    });
  });

  it('should default to Option-0-A, add Option-0-B to the multi selection, emit a combined toast, and keep both checked on reopen', async () => {
    await setMenuMode(0, 'multi');

    await textItem('Bar 1').longPress();
    await expect(checkmarkFor('Option-0-A')).toBeVisible();

    await element(by.text('Option-0-B')).tap();
    await dismissToastByMessage('Pressed Item 1');
    await dismissToastByMessage('Item 1 [multi]: "Option-0-A", "Option-0-B"');

    await textItem('Bar 1').longPress();
    await expect(checkmarkFor('Option-0-A')).toBeVisible();
    await expect(checkmarkFor('Option-0-B')).toBeVisible();
    await dismissToastByMessage('Pressed Item 1');
  });

  it("should replace Item 1's text button with its custom render view when Custom view is enabled, leaving Item 2 untouched", async () => {
    await element(by.id('custom-view-switch-0')).tap();

    await expect(element(by.id('custom-item-0'))).toBeVisible();
    await expect(textItem('Bar 1')).not.toExist();
    await expect(textItem('Foo 2')).toBeVisible();
  });

  it('should keep the custom render view (not revert to a text button) when the Title picker changes while Custom view is enabled', async () => {
    await setTitle(0, 'foo');

    await expect(element(by.id('custom-item-0'))).toBeVisible();
    await expect(textItem('Foo 1')).not.toExist();
  });

  it('should add a third trailing item when Add Item 3 is pressed', async () => {
    await element(by.id('toggle-item-3-button')).tap();

    await expect(textItem('Foo 3')).toBeVisible();
    await expect(element(by.id('toggle-item-3-button'))).toHaveLabel(
      'Remove Item 3',
    );
  });

  it('should remove the third trailing item when Remove Item 3 is pressed', async () => {
    await element(by.id('toggle-item-3-button')).tap();

    await expect(textItem('Foo 3')).not.toExist();
    await expect(element(by.id('toggle-item-3-button'))).toHaveLabel(
      'Add Item 3',
    );
    await expect(element(by.id('custom-item-0'))).toBeVisible();
    await expect(textItem('Foo 2')).toBeVisible();
  });
});
