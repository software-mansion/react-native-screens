import { device } from 'detox';
import { disableStylusPopupOnAndroid } from '@e2e/framework/disable-stylus-popup-android';

beforeAll(async () => {
  await device.launchApp();
  disableStylusPopupOnAndroid();
});

afterAll(async () => {
  await device.terminateApp();
});
