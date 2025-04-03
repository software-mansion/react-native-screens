import { device } from 'detox';

beforeAll(async () => {
  await device.launchApp();
});

afterAll(async () => {
  await device.terminateApp();
});
