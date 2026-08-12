import { device, element, by } from 'detox';
import { forceTapByLabeliOS } from '../e2e-utils';

/**
 * Selects a tab by its label. On iOS the tab bar can sit under other UI layers
 * and fail Detox's visibility check, so the tap goes through coordinates there;
 * on Android a plain tap is enough.
 */
export async function forceSelectTabByLabel(label: string) {
  if (device.getPlatform() === 'ios') {
    await forceTapByLabeliOS(label);
  } else {
    await element(by.label(label)).tap();
  }
}
