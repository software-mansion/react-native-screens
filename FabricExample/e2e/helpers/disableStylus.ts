import { getCommandLineResponse } from "react-native-screens/scripts/e2e/command-line-helpers";
import { device } from 'detox';

export function disableStylusPopupOnAndroid() {
  if (device.getPlatform() === 'ios') return;
  try {
    getCommandLineResponse(`adb -s ${device.id} shell settings put secure stylus_handwriting_enabled 0`);
  } catch {
    console.warn('Failed to disable stylus setting.');
  }
}
