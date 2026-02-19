import { device } from 'detox';
import disableStylusPopupOnAndroid from './helpers/disableStylusPopupOnAndroid';

beforeAll(async () => {
  await device.launchApp();
  disableStylusPopupOnAndroid();
});

afterAll(async () => {
  await device.terminateApp();
});
