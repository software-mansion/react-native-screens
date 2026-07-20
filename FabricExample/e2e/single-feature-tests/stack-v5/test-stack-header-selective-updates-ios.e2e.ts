import { device, expect, element, by } from 'detox';
import {
  describeIfiOS,
  dismissToast,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';
import {
  CLASS_NAME_UI_BUTTON_BAR_BUTTON,
  CLASS_NAME_UI_CONTEXT_MENU_CELL_CONTENT_VIEW,
} from '../../native-class-names';

/**
 * This scenario's primary claim (see scenario.md) is that on iOS 26+, only
 * the header item whose props actually changed shows a native rebuild
 * flash/blur, and unrelated items don't. That flash is a transient native
 * render effect with no observable JS-side signal, so Detox cannot assert it
 * — it is intentionally left out of this spec (see e2e-test-creator's
 * coverage report for the full step-by-step breakdown). What this spec does
 * cover: that the *scoped update itself* lands correctly (the right item's
 * title/menu/custom-view actually changes while its sibling stays put), and
 * the menu selection semantics (single vs multi, default selection, checkmark
 * persistence) exercised alongside it.
 */

/**
 * A trailing header item rendered as a plain text bar button (no `render`
 * override). Both a menu-less item and one with a `menu` attached resolve to
 * this native class — confirmed on-device via native view inspection.
 */
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

  it('should display both trailing items with their initial titles (Step 1)', async () => {
    await expect(textItem('Foo 1')).toBeVisible();
    await expect(textItem('Foo 2')).toBeVisible();
  });

  it("should update only Item 1's header title when its Title picker changes to bar, leaving Item 2 untouched (Step 2)", async () => {
    await setTitle(0, 'bar');

    await expect(textItem('Bar 1')).toBeVisible();
    await expect(textItem('Foo 1')).not.toExist();
    await expect(textItem('Foo 2')).toBeVisible();
  });

  it('should attach a native menu to Item 1 when its Menu picker changes to single (Step 3)', async () => {
    await setMenuMode(0, 'single');

    await expect(element(by.id('menu-picker-0'))).toHaveLabel('Menu: single');
  });

  describe('opening Item 1 menu by long press with singleSelection (Step 4)', () => {
    it('should select Option-0-B via the menu and emit the selection toast', async () => {
      await textItem('Bar 1').longPress();
      await expect(checkmarkFor('Option-0-A')).toBeVisible();

      await element(by.text('Option-0-B')).tap();
      await dismissToast('1. Item 1 [single]: "Option-0-B"');
    });

    it('should show only Option-0-B checked when the menu is reopened', async () => {
      await textItem('Bar 1').longPress();

      await expect(checkmarkFor('Option-0-B')).toBeVisible();
      await expect(checkmarkFor('Option-0-A')).not.toExist();

      // Dismiss without selecting: tap a point well clear of the menu platter.
      await element(by.text('Item 2')).tap();
    });
  });

  it('should default to Option-0-A selected when Menu changes to multi and the menu is reopened (Step 5)', async () => {
    await setMenuMode(0, 'multi');

    await textItem('Bar 1').longPress();
    await expect(checkmarkFor('Option-0-A')).toBeVisible();
  });

  it('should add Option-0-B to the multi selection, emit a combined toast, and keep both checked on reopen (Step 6)', async () => {
    await element(by.text('Option-0-B')).tap();
    await dismissToast('1. Item 1 [multi]: "Option-0-A", "Option-0-B"');

    await textItem('Bar 1').longPress();
    await expect(checkmarkFor('Option-0-A')).toBeVisible();
    await expect(checkmarkFor('Option-0-B')).toBeVisible();

    await element(by.text('Item 2')).tap();
  });

  it("should replace Item 1's text button with its custom render view when Custom view is enabled, leaving Item 2 untouched (Step 7)", async () => {
    await element(by.id('custom-view-switch-0')).tap();

    await expect(element(by.id('custom-item-0'))).toBeVisible();
    await expect(textItem('Bar 1')).not.toExist();
    await expect(textItem('Foo 2')).toBeVisible();
  });

  it('should keep the custom render view (not revert to a text button) when the Title picker changes while Custom view is enabled (Step 8)', async () => {
    await setTitle(0, 'foo');

    await expect(element(by.id('custom-item-0'))).toBeVisible();
    await expect(textItem('Foo 1')).not.toExist();
  });

  it('should add a third trailing item when Add Item 3 is pressed (Step 9)', async () => {
    await element(by.id('toggle-item-3-button')).tap();

    await expect(textItem('Foo 3')).toBeVisible();
    await expect(element(by.id('toggle-item-3-button'))).toHaveLabel(
      'Remove Item 3',
    );
  });

  it('should remove the third trailing item when Remove Item 3 is pressed (Step 10)', async () => {
    await element(by.id('toggle-item-3-button')).tap();

    await expect(textItem('Foo 3')).not.toExist();
    await expect(element(by.id('toggle-item-3-button'))).toHaveLabel(
      'Add Item 3',
    );
    await expect(element(by.id('custom-item-0'))).toBeVisible();
    await expect(textItem('Foo 2')).toBeVisible();
  });
});
