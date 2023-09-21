import { device } from 'detox';

beforeAll(async () => {
  await device.launchApp({
    launchArgs: {
      isDetox: true,
    },
  });
});

afterAll(async () => {
  await device.terminateApp();
});
