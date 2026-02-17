import { device, expect, element, by } from 'detox';
import { selectIssueTestScreen } from '../e2e-utils';

const expectBackButtonMenuWithTheSameLabel = async (text: string) => {
  await element(by.text(text)).longPressAndDrag(
    700,
    NaN,
    NaN,
    element(by.text('VOID')),
    NaN,
    NaN,
    'fast',
    0,
  ); // open
  await waitFor(element(by.type('_UIContextMenuView'))).toBeVisible();
  await expect(
    element(by.text(text).withAncestor(by.type('_UIContextMenuView'))),
  ).toBeVisible();
  await element(by.text('VOID')).tap(); // close
  await waitFor(element(by.type('_UIContextMenuView'))).not.toBeVisible();
  await waitFor(element(by.text(text)).atIndex(1)).not.toExist();
  await expect(element(by.text(text)).atIndex(0)).toBeVisible();
};

const expectBackButtonMenuWithDifferentLabels = async (
  buttonTitle: string,
  backButtonMenuLabel: string,
) => {
  await element(by.text(buttonTitle)).longPressAndDrag(
    700,
    NaN,
    NaN,
    element(by.text('VOID')),
    NaN,
    NaN,
    'fast',
    0,
  ); // open
  await waitFor(element(by.type('_UIContextMenuView'))).toBeVisible();
  await expect(
    element(
      by.text(backButtonMenuLabel).withAncestor(by.type('_UIContextMenuView')),
    ),
  ).toBeVisible();
  await element(by.text('VOID')).tap(); // close
  await waitFor(element(by.type('_UIContextMenuView'))).not.toBeVisible();
  await waitFor(element(by.text(backButtonMenuLabel))).not.toBeVisible();
  await expect(element(by.text(buttonTitle))).toBeVisible();
};

const expectBackButtonMenuIconAndLabel = async (
  buttonId: string,
  backButtonMenuLabel: string,
) => {
  await element(by.id(buttonId)).longPressAndDrag(
    700,
    NaN,
    NaN,
    element(by.text('VOID')),
    NaN,
    NaN,
    'fast',
    0,
  ); // open
  await expect(
    element(
      by.text(backButtonMenuLabel).withAncestor(by.type('_UIContextMenuView')),
    ),
  ).toBeVisible();
  await waitFor(element(by.type('_UIContextMenuView'))).toBeVisible();
  await element(by.text('VOID')).tap(); // close
  await waitFor(element(by.type('_UIContextMenuView'))).not.toBeVisible();
};

const expectBackButtonMenuToNotExistOnLabel = async (text: string) => {
  await element(by.text(text)).longPressAndDrag(
    700,
    NaN,
    NaN,
    element(by.text('VOID')),
    NaN,
    NaN,
    'fast',
    0,
  ); // open
  await expect(element(by.type('_UIContextMenuView'))).not.toExist();
};

const expectInitialPageToExist = async (
  testName: string,
  expectToExist: Detox.NativeMatcher,
  expectToNotExist?: Detox.NativeMatcher,
) => {
  await element(by.text(testName)).tap();
  await element(by.text('Open screen')).tap();
  await expect(element(expectToExist)).toBeVisible();
  if (expectToNotExist) {
    await expect(element(expectToNotExist)).not.toBeVisible();
  }
};

// TODO: Fix & reenable after https://github.com/software-mansion/react-native-screens/pull/3303
describe.skip('Test2809', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test2809 should exist', async () => {
    await selectIssueTestScreen('Test2809');
  });

  describe('backButtonMenuEnabled: true', () => {
    afterEach(async () => {
      await element(by.text('Pop to top')).tap(); // Go back
    });

    describe('backButtonDisplayMode: default', () => {
      it('default text stays visible and matches label in back button menu', async () => {
        await expectInitialPageToExist(
          'EnabledDefaultDefaultText',
          by.text('First'),
        );
        await expectBackButtonMenuWithTheSameLabel('First'); // Check if backButtonMenu works
      });

      it('custom text stays visible and matches label in back button menu', async () => {
        await expectInitialPageToExist(
          'EnabledDefaultCustomText',
          by.text('Custom'),
        );
        await expectBackButtonMenuWithTheSameLabel('Custom'); // Check if backButtonMenu works
      });

      // We don't check if the styles are applied, I think that it could be flaky, but it can be done
      // using element(by.type('UIButtonLabel')).getAttributes() and looking at bounds. The values there
      // doesn't match the ones in the code exactly (I think some padding is added), so I don't think we should do that.
      it('styled text stays visible and matches label in back button menu', async () => {
        await expectInitialPageToExist(
          'EnabledDefaultStyledText',
          by.text('First'),
        );
        await expectBackButtonMenuWithTheSameLabel('First'); // Check if backButtonMenu works
      });
    });

    describe('backButtonDisplayMode: generic', () => {
      it('default text is truncated by backButtonDisplayMode and is used in back button menu', async () => {
        await expectInitialPageToExist(
          'EnabledGenericDefaultText',
          by.text('Back'),
        );
        await expectBackButtonMenuWithDifferentLabels('Back', 'First'); // Check if backButtonMenu works
      });

      it('custom text is truncated by backButtonDisplayMode and is used in back button menu', async () => {
        await expectInitialPageToExist(
          'EnabledGenericCustomText',
          by.text('Back'),
        );
        await expectBackButtonMenuWithDifferentLabels('Back', 'Custom'); // Check if backButtonMenu works
      });

      // Custom styles override backButtonDisplayMode
      it('styled text is NOT truncated by backButtonDisplayMode and is used in back button menu', async () => {
        await expectInitialPageToExist(
          'EnabledGenericStyledText',
          by.text('First'),
        );
        await expectBackButtonMenuWithTheSameLabel('First'); // Check if backButtonMenu works
      });
    });

    describe('backButtonDisplayMode: minimal', () => {
      it('chevron is used as back button and default text is used in back button menu', async () => {
        await expectInitialPageToExist(
          'EnabledMinimalDefaultText',
          by.id('chevron.backward'),
          by.text('First'),
        );
        await expectBackButtonMenuIconAndLabel('chevron.backward', 'First'); // Check if backButtonMenu works
      });

      it('chevron is used as back button and custom text is used in back button menu', async () => {
        await expectInitialPageToExist(
          'EnabledMinimalCustomText',
          by.id('chevron.backward'),
          by.text('Custom'),
        );
        await expectBackButtonMenuIconAndLabel('chevron.backward', 'Custom'); // Check if backButtonMenu works
      });

      it('styles are omitted, chevron is used as back button and default text is used in back button menu', async () => {
        await expectInitialPageToExist(
          'EnabledMinimalStyledText',
          by.id('chevron.backward'),
          by.text('First'),
        );
        await expectBackButtonMenuIconAndLabel('chevron.backward', 'First'); // Check if backButtonMenu works
      });
    });
  });

  describe('backButtonMenuEnabled: false', () => {
    afterEach(async () => {
      await element(by.text('Pop to top')).tap(); // Go back
    });

    describe('backButtonDisplayMode: default', () => {
      it('default text stays visible and back button menu is disabled', async () => {
        await expectInitialPageToExist(
          'DisabledDefaultDefaultText',
          by.text('First'),
        );
        await expectBackButtonMenuToNotExistOnLabel('First'); // Check if backButtonMenu is disabled
      });

      it('custom text stays visible and back button menu is disabled', async () => {
        await expectInitialPageToExist(
          'DisabledDefaultCustomText',
          by.text('Custom'),
        );
        await expectBackButtonMenuToNotExistOnLabel('Custom'); // Check if backButtonMenu is disabled
      });

      it('styled text stays visible and back button menu is disabled', async () => {
        await expectInitialPageToExist(
          'DisabledDefaultStyledText',
          by.text('First'),
        );
        await expectBackButtonMenuToNotExistOnLabel('First'); // Check if backButtonMenu is disabled
      });
    });

    // [backButtonMenuEnabled: false and backButtonDisplayMode: generic]
    // generic is not working as currently backButtonDisplayMode is causing backButtonItem to be set
    describe('backButtonDisplayMode: generic', () => {
      it('default text is visible, because backButtonDisplayMode is overwritten by backButtonDisplayMode', async () => {
        await expectInitialPageToExist(
          'DisabledGenericDefaultText',
          by.text('First'),
        );
        await expectBackButtonMenuToNotExistOnLabel('First'); // Check if backButtonMenu is disabled
      });

      it('custom text is visible, because backButtonDisplayMode is overwritten by backButtonDisplayMode', async () => {
        await expectInitialPageToExist(
          'DisabledGenericCustomText',
          by.text('Custom'),
        );
        await expectBackButtonMenuToNotExistOnLabel('Custom'); // Check if backButtonMenu is disabled
      });

      it('styled text is visible, because backButtonDisplayMode is overwritten by backButtonDisplayMode', async () => {
        await expectInitialPageToExist(
          'DisabledGenericStyledText',
          by.text('First'),
        );
        await expectBackButtonMenuToNotExistOnLabel('First'); // Check if backButtonMenu is disabled
      });
    });

    // [backButtonMenuEnabled: false and backButtonDisplayMode: minimal]
    // backButtonDisplayMode: minimal works as a kill switch so backButtonMenu value is omitted
    describe('backButtonDisplayMode: minimal', () => {
      it('chevron is used as back button and default text is used in back button menu, backButtonMenuEnabled is omitted', async () => {
        await expectInitialPageToExist(
          'DisabledMinimalDefaultText',
          by.id('chevron.backward'),
          by.text('First'),
        );
        await expectBackButtonMenuIconAndLabel('chevron.backward', 'First'); // Check if backButtonMenu works
      });

      it('chevron is used as back button and custom text is used in back button menu, backButtonMenuEnabled is omitted', async () => {
        await expectInitialPageToExist(
          'DisabledMinimalCustomText',
          by.id('chevron.backward'),
          by.text('Custom'),
        );
        await expectBackButtonMenuIconAndLabel('chevron.backward', 'Custom'); // Check if backButtonMenu works
      });

      it('backButtonMenuEnabled is omitted, chevron is used as back button and default text is used in back button menu', async () => {
        await expectInitialPageToExist(
          'DisabledMinimalStyledText',
          by.id('chevron.backward'),
          by.text('First'),
        );
        await expectBackButtonMenuIconAndLabel('chevron.backward', 'First'); // Check if backButtonMenu works
      });
    });
  });

  // Custom
  it('Default long back label should be truncated to generic by backButtonDisplayMode', async () => {
    await expectInitialPageToExist('CustomLongDefaultText', by.text('Back'));
    await expectBackButtonMenuWithDifferentLabels(
      'Back',
      'LongLongLongLongLong',
    ); // Check if backButtonMenu works
    await element(by.text('Pop to top')).tap(); // Go back
  });

  it('Default label should be truncated to minimal by backButtonDisplayMode when title is long', async () => {
    await expectInitialPageToExist(
      'CustomDefaultTextWithLongTitle',
      by.id('chevron.backward'),
      by.text('First'),
    );
    await expectBackButtonMenuIconAndLabel('chevron.backward', 'First'); // Check if backButtonMenu works
    await element(by.text('Pop to top')).tap(); // Go back
  });

  it('Custom long back label should be truncated to generic by backButtonDisplayMode', async () => {
    await expectInitialPageToExist('CustomLongCustomText', by.text('Back'));
    await expectBackButtonMenuWithDifferentLabels(
      'Back',
      'LongLongLongLongLong',
    ); // Check if backButtonMenu works
    await element(by.text('Pop to top')).tap(); // Go back
  });

  it('Custom back label should be truncated to minimal by backButtonDisplayMode when title is long', async () => {
    await expectInitialPageToExist(
      'CustomCustomTextWithLongTitle',
      by.id('chevron.backward'),
      by.text('CustomBack'),
    );
    await expectBackButtonMenuIconAndLabel('chevron.backward', 'CustomBack'); // Check if backButtonMenu works
    await element(by.text('Pop to top')).tap(); // Go back
  });
});
