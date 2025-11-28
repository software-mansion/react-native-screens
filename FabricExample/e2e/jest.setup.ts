import { device } from 'detox';
import { disableStylusPopupOnAndroid } from './helpers/disableStylus';

beforeAll(async () => {
  await device.launchApp();
  disableStylusPopupOnAndroid();
});

afterAll(async () => {
  await device.terminateApp();
});
