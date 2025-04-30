import { device, expect, element, by } from 'detox';
import { describeIfiOS } from '../e2e-utils';

// headerLargeTitle is supported only on iOS
describeIfiOS('Test649', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test649 should exist', async () => {
    await waitFor(element(by.id('root-screen-tests-Test649')))
      .toBeVisible()
      .whileElement(by.id('root-screen-examples-scrollview'))
      .scroll(600, 'down', NaN, 0.85);

    await expect(element(by.id('root-screen-tests-Test649'))).toBeVisible();
    await element(by.id('root-screen-tests-Test649')).tap();
  });

  it('header large title "First" should be fully visible', async () => {
    await expect(
      element(
        by
          .text('First')
          .withAncestor(by.type('_UINavigationBarLargeTitleView')),
      ),
    ).toBeVisible(100);
  });

  it('header title "Second" should not be a large title', async () => {
    await element(by.id('first-button-go-to-second')).tap();
    await expect(
      element(
        by
          .text('Second')
          .withAncestor(by.type('_UINavigationBarLargeTitleView')),
      ),
    ).not.toBeVisible(100);
  });

  it('header large title "First" should be fully visible after coming back from Second', async () => {
    await element(by.id('second-button-go-to-first')).tap();
    await expect(
      element(
        by
          .text('First')
          .withAncestor(by.type('_UINavigationBarLargeTitleView')),
      ),
    ).toBeVisible(100);
  });
});
