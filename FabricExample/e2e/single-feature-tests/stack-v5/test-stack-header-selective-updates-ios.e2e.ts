import { device, expect, element, by } from 'detox';
import {
  checkmarkFor,
  describeIfiOS,
  dismissToast,
  headerItem as textItem,
  openContextMenu,
  selectPickerOption,
  selectSingleFeatureTestsScreen,
} from '../../e2e-utils';

// `SettingsPicker` derives its option testIDs from the label only, not the item
// index (`title-foo`, `menu-single`, …), so those IDs are duplicated across
// item sections. They resolve unambiguously only because each helper opens a
// single picker, taps the option, and closes it again before the next call -
// i.e. at most one picker is expanded at any time. Keep that invariant.
async function setTitle(itemIndex: number, variant: 'foo' | 'bar') {
  await selectPickerOption({
    pickerId: `title-picker-${itemIndex}`,
    label: 'Title',
    option: variant,
  });
}

async function setMenuMode(
  itemIndex: number,
  mode: 'none' | 'single' | 'multi',
) {
  await selectPickerOption({
    pickerId: `menu-picker-${itemIndex}`,
    label: 'Menu',
    option: mode,
  });
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
      await openContextMenu(textItem('Bar 1'), { gesture: 'longPress' });
      await expect(checkmarkFor('Option-0-A')).toBeVisible();

      await element(by.text('Option-0-B')).tap();
      await dismissToast('1. Pressed Item 1');
      await dismissToast('1. Item 1 [single]: "Option-0-B"');
    });

    it('should show only Option-0-B checked when the menu is reopened', async () => {
      await openContextMenu(textItem('Bar 1'), { gesture: 'longPress' });

      await expect(checkmarkFor('Option-0-B')).toBeVisible();
      await expect(checkmarkFor('Option-0-A')).not.toExist();
      await dismissToast('1. Pressed Item 1');
    });
  });

  it('should default to Option-0-A, add Option-0-B to the multi selection, emit a combined toast, and keep both checked on reopen', async () => {
    await setMenuMode(0, 'multi');

    await openContextMenu(textItem('Bar 1'), { gesture: 'longPress' });
    await expect(checkmarkFor('Option-0-A')).toBeVisible();

    await element(by.text('Option-0-B')).tap();
    await dismissToast('1. Pressed Item 1');
    await dismissToast('1. Item 1 [multi]: "Option-0-A", "Option-0-B"');

    await openContextMenu(textItem('Bar 1'), { gesture: 'longPress' });
    await expect(checkmarkFor('Option-0-A')).toBeVisible();
    await expect(checkmarkFor('Option-0-B')).toBeVisible();
    await dismissToast('1. Pressed Item 1');
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
