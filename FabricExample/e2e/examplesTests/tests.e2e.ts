import { device, expect, element, by } from 'detox';

describe('Test432', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('should Test432 exist', async () => {
    await waitFor(element(by.id('root-screen-tests-Test432')))
    .toBeVisible()
    .whileElement(by.id('root-screen-examples-scrollview'))
    .scroll(100, 'down', NaN, 0.85);

    await expect(element(by.id('root-screen-tests-Test432'))).toBeVisible();
    await element(by.id('root-screen-tests-Test432')).tap();
  });


  // home home-square
  // details details-red-square | click | details-green-square | click | details-red-square | back
  // info info-green-square-1 | click | info-red-square info-green-square-1 info-green-square-2 | click | info-green-square-1 | back
  // settings settings-square
  // za kazdym powrotem do home sprawdzic czarny square



});
