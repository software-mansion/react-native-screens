import { device, element, by } from 'detox';
import { CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW } from '../native-class-names';

/** The platform content description of the toolbar's overflow button. */
export const OVERFLOW_MENU_LABEL = 'More options';

/** The popup window an open toolbar menu is rendered into. */
export const overflowMenuPopup = by.type(
  CLASS_NAME_ANDROID_MENU_DROP_DOWN_LIST_VIEW,
);

export async function openOverflowMenu() {
  await element(by.label(OVERFLOW_MENU_LABEL)).tap();
}

/**
 * Only safe while the menu is known to be up — a Back press with no popup in
 * front of it pops the test screen instead.
 */
export async function closeOverflowMenu() {
  await device.pressBack();
}
