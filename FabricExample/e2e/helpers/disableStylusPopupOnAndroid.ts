import { device } from 'detox';

const {
  getCommandLineResponse,
} = require('../../../scripts/e2e/command-line-helpers');

/**
 * Some devices may display an introductory popup to enable stylus input as the default input method. This popup is not a subject of react-native-screens testing and breaks the react-native-screens e2e test flow.
 * This function disables the display of the pop-up window by modifying a special system flag.
 */
export default function disableStylusPopupOnAndroid() {
  if (device.getPlatform() === 'ios') return;
  try {
    getCommandLineResponse(
      `adb -s ${device.id} shell settings put secure stylus_handwriting_enabled 0`,
    );
  } catch {
    console.warn('Failed to disable stylus setting.');
  }
}
