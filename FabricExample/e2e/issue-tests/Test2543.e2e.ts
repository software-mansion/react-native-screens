import { device, expect, element, by } from 'detox';
import { describeIfiOS, selectIssueTestScreen } from '../e2e-utils';

async function testDetentsVisibility(
  testCaseName: string,
  firstVisible: boolean,
  secondVisible: boolean,
  thirdVisible: boolean,
) {
  const firstDetent = element(by.id(`${testCaseName}-text-first-detent`));
  const secondDetent = element(by.id(`${testCaseName}-text-second-detent`));
  const thirdDetent = element(by.id(`${testCaseName}-text-third-detent`));

  if (firstVisible) {
    await expect(firstDetent).toBeVisible();
  } else {
    await expect(firstDetent).not.toBeVisible();
  }

  if (secondVisible) {
    await expect(secondDetent).toBeVisible();
  } else {
    await expect(secondDetent).not.toBeVisible();
  }

  if (thirdVisible) {
    await expect(thirdDetent).toBeVisible();
  } else {
    await expect(thirdDetent).not.toBeVisible();
  }
}

// issue related to iOS formSheet initial detent
describeIfiOS('Test2543', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test2543 should exist', async () => {
    await selectIssueTestScreen('Test2543');
  });

  it('formSheet with 2 detents, initial first, should allow changing detents', async () => {
    await testDetentsVisibility('TwoDetentsInitialFirst', false, false, false);

    await element(by.id('home-button-open-TwoDetentsInitialFirst')).tap();
    await testDetentsVisibility('TwoDetentsInitialFirst', true, false, false);

    const header = element(by.id('TwoDetentsInitialFirst-text-header'));
    await header.swipe('up', 'slow', 0.25);
    await testDetentsVisibility('TwoDetentsInitialFirst', true, true, false);

    await header.swipe('down', 'slow', 0.25);
    await testDetentsVisibility('TwoDetentsInitialFirst', true, false, false);

    await header.swipe('down', 'slow', 0.25);
    await testDetentsVisibility('TwoDetentsInitialFirst', false, false, false);
  });

  it('formSheet with 2 detents, initial second, should allow changing detents', async () => {
    await testDetentsVisibility('TwoDetentsInitialSecond', false, false, false);

    await element(by.id('home-button-open-TwoDetentsInitialSecond')).tap();
    await testDetentsVisibility('TwoDetentsInitialSecond', true, true, false);

    const header = element(by.id('TwoDetentsInitialSecond-text-header'));
    await header.swipe('down', 'slow', 0.25);
    await testDetentsVisibility('TwoDetentsInitialSecond', true, false, false);

    await header.swipe('up', 'slow', 0.25);
    await testDetentsVisibility('TwoDetentsInitialSecond', true, true, false);

    await header.swipe('down', 'slow', 0.5);
    await testDetentsVisibility('TwoDetentsInitialSecond', false, false, false);
  });

  it('formSheet with 3 detents, initial first, should allow changing detents', async () => {
    await testDetentsVisibility(
      'ThreeDetentsInitialFirst',
      false,
      false,
      false,
    );

    await element(by.id('home-button-open-ThreeDetentsInitialFirst')).tap();
    await testDetentsVisibility('ThreeDetentsInitialFirst', true, false, false);

    const header = element(by.id('ThreeDetentsInitialFirst-text-header'));
    await header.swipe('up', 'slow', 0.25);
    await testDetentsVisibility('ThreeDetentsInitialFirst', true, true, false);

    await header.swipe('up', 'slow', 0.25);
    await testDetentsVisibility('ThreeDetentsInitialFirst', true, true, true);

    await header.swipe('down', 'slow', 0.25);
    await testDetentsVisibility('ThreeDetentsInitialFirst', true, true, false);

    await header.swipe('down', 'slow', 0.25);
    await testDetentsVisibility('ThreeDetentsInitialFirst', true, false, false);

    await header.swipe('up', 'slow', 0.5);
    await testDetentsVisibility('ThreeDetentsInitialFirst', true, true, true);

    await header.swipe('down', 'slow', 0.75);
    await testDetentsVisibility(
      'ThreeDetentsInitialFirst',
      false,
      false,
      false,
    );
  });

  it('formSheet with 3 detents, initial second, should allow changing detents', async () => {
    await testDetentsVisibility(
      'ThreeDetentsInitialSecond',
      false,
      false,
      false,
    );

    await element(by.id('home-button-open-ThreeDetentsInitialSecond')).tap();
    await testDetentsVisibility('ThreeDetentsInitialSecond', true, true, false);

    const header = element(by.id('ThreeDetentsInitialSecond-text-header'));
    await header.swipe('down', 'slow', 0.25);
    await testDetentsVisibility(
      'ThreeDetentsInitialSecond',
      true,
      false,
      false,
    );

    await header.swipe('up', 'slow', 0.25);
    await testDetentsVisibility('ThreeDetentsInitialSecond', true, true, false);

    await header.swipe('up', 'slow', 0.25);
    await testDetentsVisibility('ThreeDetentsInitialSecond', true, true, true);

    await header.swipe('down', 'slow', 0.25);
    await testDetentsVisibility('ThreeDetentsInitialSecond', true, true, false);

    await header.swipe('down', 'slow', 0.25);
    await testDetentsVisibility(
      'ThreeDetentsInitialSecond',
      true,
      false,
      false,
    );

    await header.swipe('up', 'slow', 0.5);
    await testDetentsVisibility('ThreeDetentsInitialSecond', true, true, true);

    await header.swipe('down', 'slow', 0.75);
    await testDetentsVisibility(
      'ThreeDetentsInitialSecond',
      false,
      false,
      false,
    );
  });

  it('formSheet with 3 detents, initial third, should allow changing detents', async () => {
    await testDetentsVisibility(
      'ThreeDetentsInitialThird',
      false,
      false,
      false,
    );

    await element(by.id('home-button-open-ThreeDetentsInitialThird')).tap();
    await testDetentsVisibility('ThreeDetentsInitialThird', true, true, true);

    const header = element(by.id('ThreeDetentsInitialThird-text-header'));
    await header.swipe('down', 'slow', 0.25);
    await testDetentsVisibility('ThreeDetentsInitialThird', true, true, false);

    await header.swipe('down', 'slow', 0.25);
    await testDetentsVisibility('ThreeDetentsInitialThird', true, false, false);

    await header.swipe('up', 'slow', 0.25);
    await testDetentsVisibility('ThreeDetentsInitialThird', true, true, false);

    await header.swipe('up', 'slow', 0.25);
    await testDetentsVisibility('ThreeDetentsInitialThird', true, true, true);

    await header.swipe('down', 'slow', 0.5);
    await testDetentsVisibility('ThreeDetentsInitialThird', true, false, false);

    await header.swipe('up', 'slow', 0.5);
    await testDetentsVisibility('ThreeDetentsInitialThird', true, true, true);

    await header.swipe('down', 'slow', 0.75);
    await testDetentsVisibility(
      'ThreeDetentsInitialThird',
      false,
      false,
      false,
    );
  });
});
