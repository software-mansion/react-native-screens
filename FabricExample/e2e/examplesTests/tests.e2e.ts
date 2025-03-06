import { device } from 'detox';

describe('E2E', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

});
