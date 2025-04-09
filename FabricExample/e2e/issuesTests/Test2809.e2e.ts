import { device, expect, element, by } from 'detox';
import { describeIfiOS } from '../e2e-utils';

const expectBackButtonMenuWithTheSameLabel = async (text: string) => {
   await element(by.text(text)).longPressAndDrag(700, NaN, NaN, element(by.text('VOID')), NaN, NaN, "fast", 0); // open
   await waitFor(element(by.type('_UIContextMenuView'))).toBeVisible();
   await expect(element(by.text(text).withAncestor(by.type('_UIContextMenuView')))).toBeVisible();
   await element(by.text('VOID')).tap(); // close
   await waitFor(element(by.type('_UIContextMenuView'))).not.toBeVisible();
   await waitFor(element(by.text(text)).atIndex(1)).not.toExist();
   await expect(element(by.text(text)).atIndex(0)).toBeVisible();
};

const expectBackButtonMenuWithDifferentLabels = async (buttonTitle: string, backButtonMenuLabel: string) => {
   await element(by.text(buttonTitle)).longPressAndDrag(700, NaN, NaN, element(by.text('VOID')), NaN, NaN, "fast", 0); // open
   await waitFor(element(by.type('_UIContextMenuView'))).toBeVisible();
   await expect(element(by.text(backButtonMenuLabel).withAncestor(by.type('_UIContextMenuView')))).toBeVisible();
   await element(by.text('VOID')).tap(); // close
   await waitFor(element(by.type('_UIContextMenuView'))).not.toBeVisible();
   await waitFor(element(by.text(backButtonMenuLabel))).not.toBeVisible();
   await expect(element(by.text(buttonTitle))).toBeVisible();
};

const expectBackButtonMenuIconAndLabel = async (buttonId: string, backButtonMenuLabel: string) => {
   await element(by.id(buttonId)).longPressAndDrag(700, NaN, NaN, element(by.text('VOID')), NaN, NaN, "fast", 0); // open
   await expect(element(by.text(backButtonMenuLabel).withAncestor(by.type('_UIContextMenuView')))).toBeVisible();
   await waitFor(element(by.type('_UIContextMenuView'))).toBeVisible();
   await element(by.text('VOID')).tap(); // close
   await waitFor(element(by.type('_UIContextMenuView'))).not.toBeVisible();
};

const expectBackButtonMenuToNotExistOnLabel = async (text: string) => {
   await element(by.text(text)).longPressAndDrag(700, NaN, NaN, element(by.text('VOID')), NaN, NaN, "fast", 0); // open
   await expect(element(by.type('_UIContextMenuView'))).not.toExist();
};


describeIfiOS('Test2809', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test2809 should exist', async () => {
   await waitFor(element(by.id('root-screen-tests-Test2809')))
     .toBeVisible()
     .whileElement(by.id('root-screen-examples-scrollview'))
     .scroll(600, 'down', NaN, 0.85);

   await expect(element(by.id('root-screen-tests-Test2809'))).toBeVisible();
   await element(by.id('root-screen-tests-Test2809')).tap();
 });

   describe('backButtonMenuEnabled: true', () => {
      describe('backButtonDisplayMode: default', () => {
         it('with default text', async () => {
            await element(by.text('EnabledDefaultDefaultText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.text('First'))).toBeVisible();
            await expectBackButtonMenuWithTheSameLabel('First'); // Check if backButtonMenu works
            await element(by.text('Pop to top')).tap(); // Go back
         });

         it('with custom text', async () => {
            await element(by.text('EnabledDefaultCustomText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.text('Custom'))).toBeVisible();
            await expectBackButtonMenuWithTheSameLabel('Custom'); // Check if backButtonMenu works
            await element(by.text('Pop to top')).tap(); // Go back
         });

         // We don't check if the styles are applied, I think that it could be flaky, but it can be done
         // using element(by.type('UIButtonLabel')).getAttributes() and looking at bounds. The values there
         // doesn't match the ones in the code exactly (I think some padding is added), so I don't think we should do that.
         it('with styled text', async () => {
            await element(by.text('EnabledDefaultStyledText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.text('First'))).toBeVisible();
            await expectBackButtonMenuWithTheSameLabel('First'); // Check if backButtonMenu works
            await element(by.text('Pop to top')).tap(); // Go back
         });
      });

      describe('backButtonDisplayMode: generic', () => {
         it('with default text', async () => {
            await element(by.text('EnabledGenericDefaultText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.text('Back'))).toBeVisible();
            await expectBackButtonMenuWithDifferentLabels('Back', 'First'); // Check if backButtonMenu works
            await element(by.text('Pop to top')).tap(); // Go back
         });

         // TODO: We should be able to fix that
         // Custom text overrides backButtonDisplayMode
         it('has custom text', async () => {
            await element(by.text('EnabledGenericCustomText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.text('Custom'))).toBeVisible(); // TODO: We should be able to fix that
            await expectBackButtonMenuWithTheSameLabel('Custom'); // Check if backButtonMenu works
            await element(by.text('Pop to top')).tap(); // Go back
         });

         // Custom styles override backButtonDisplayMode
         it('with custom text', async () => {
            await element(by.text('EnabledGenericStyledText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.text('First'))).toBeVisible();
            await expectBackButtonMenuWithTheSameLabel('First'); // Check if backButtonMenu works
            await element(by.text('Pop to top')).tap(); // Go back
         });
      });

      describe('backButtonDisplayMode: minimal', () => {
         it('with default text', async () => {
            await element(by.text('EnabledMinimalDefaultText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.id('chevron.backward'))).toBeVisible();
            await expect(element(by.text('First'))).not.toBeVisible();
            await expectBackButtonMenuIconAndLabel('chevron.backward', 'First'); // Check if backButtonMenu works
            await element(by.text('Pop to top')).tap(); // Go back
         });

         it('with custom text', async () => {
            await element(by.text('EnabledMinimalCustomText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.id('chevron.backward'))).toBeVisible();
            await expect(element(by.text('Custom'))).not.toBeVisible();
            await expectBackButtonMenuIconAndLabel('chevron.backward', 'Custom'); // Check if backButtonMenu works
            await element(by.text('Pop to top')).tap(); // Go back
         });

         it('with styled text', async () => {
            await element(by.text('EnabledMinimalStyledText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.id('chevron.backward'))).toBeVisible();
            await expect(element(by.text('First'))).not.toBeVisible();
            await expectBackButtonMenuIconAndLabel('chevron.backward', 'First'); // Check if backButtonMenu works
            await element(by.text('Pop to top')).tap(); // Go back
         });
      });
   });

   describe('backButtonMenuEnabled: false', () => {
      describe('backButtonDisplayMode: default', () => {
         it('with default text', async () => {
            await element(by.text('DisabledDefaultDefaultText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.text('First'))).toBeVisible();
            await expectBackButtonMenuToNotExistOnLabel('First'); // Check if backButtonMenu is disabled
            await element(by.text('Pop to top')).tap(); // Go back
         });

         it('with custom text', async () => {
            await element(by.text('DisabledDefaultCustomText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.text('Custom'))).toBeVisible();
            await expectBackButtonMenuToNotExistOnLabel('Custom'); // Check if backButtonMenu is disabled
            await element(by.text('Pop to top')).tap(); // Go back
         });

         it('with styled text', async () => {
            await element(by.text('DisabledDefaultStyledText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.text('First'))).toBeVisible();
            await expectBackButtonMenuToNotExistOnLabel('First'); // Check if backButtonMenu is disabled
            await element(by.text('Pop to top')).tap(); // Go back
         });
      });

      // [backButtonMenuEnabled: false and backButtonDisplayMode: generic]
      // generic is not working as currently backButtonDisplayMode is causing backButtonItem to be set
      describe('backButtonDisplayMode: generic not working', () => {
         it('with default text', async () => {
            await element(by.text('DisabledGenericDefaultText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.text('First'))).toBeVisible();
            await expectBackButtonMenuToNotExistOnLabel('First'); // Check if backButtonMenu is disabled
            await element(by.text('Pop to top')).tap(); // Go back
         });

         it('with custom text', async () => {
            await element(by.text('DisabledGenericCustomText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.text('Custom'))).toBeVisible();
            await expectBackButtonMenuToNotExistOnLabel('Custom'); // Check if backButtonMenu is disabled
            await element(by.text('Pop to top')).tap(); // Go back
         });

         it('with styled text', async () => {
            await element(by.text('DisabledGenericStyledText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.text('First'))).toBeVisible();
            await expectBackButtonMenuToNotExistOnLabel('First'); // Check if backButtonMenu is disabled
            await element(by.text('Pop to top')).tap(); // Go back
         });
      });

      // [backButtonMenuEnabled: false and backButtonDisplayMode: minimal]
      // backButtonDisplayMode: minimal works as a kill switch so backButtonMenu value is omitted
      describe('backButtonDisplayMode: minimal', () => {
         it('with default text', async () => {
            await element(by.text('DisabledMinimalDefaultText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.id('chevron.backward'))).toBeVisible();
            await expect(element(by.text('First'))).not.toBeVisible();
            await expectBackButtonMenuIconAndLabel('chevron.backward', 'First');  // Check if backButtonMenu works
            await element(by.text('Pop to top')).tap(); // Go back
         });

         it('with custom text', async () => {
            await element(by.text('DisabledMinimalCustomText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.id('chevron.backward'))).toBeVisible();
            await expect(element(by.text('Custom'))).not.toBeVisible();
            await expectBackButtonMenuIconAndLabel('chevron.backward', 'Custom'); // Check if backButtonMenu works
            await element(by.text('Pop to top')).tap(); // Go back
         });

         it('with styled text', async () => {
            await element(by.text('DisabledMinimalStyledText')).tap();
            await element(by.text('Open screen')).tap();
            await expect(element(by.id('chevron.backward'))).toBeVisible();
            await expect(element(by.text('First'))).not.toBeVisible();
            await expectBackButtonMenuIconAndLabel('chevron.backward', 'First'); // Check if backButtonMenu works
            await element(by.text('Pop to top')).tap(); // Go back
         });
      });
   });

   // Custom
   it('Default long back label should be truncated to generic by buckButtonDisplayMode', async () => {
      await element(by.text('CustomLongDefaultText')).tap();
      await element(by.text('Open screen')).tap();
      await expect(element(by.text('Back'))).toBeVisible();
      await expectBackButtonMenuWithDifferentLabels('Back', 'LongLongLongLongLong'); // Check if backButtonMenu works
      await element(by.text('Pop to top')).tap(); // Go back
   });

   it('Default label should be truncated to minimal by buckButtonDisplayMode when title is long', async () => {
      await element(by.text('CustomDefaultTextWithLongTitle')).tap();
      await element(by.text('Open screen')).tap();
      await expect(element(by.id('chevron.backward'))).toBeVisible();
      await expect(element(by.text('First'))).not.toBeVisible();
      await expectBackButtonMenuIconAndLabel('chevron.backward', 'First'); // Check if backButtonMenu works
      await element(by.text('Pop to top')).tap(); // Go back
   });

   // TODO: We should be able to fix that
   // Custom text overrides backButtonDisplayMode because of using backButtonItem
   it.failing('Custom long back label should be truncated to generic by buckButtonDisplayMode', async () => {
      await element(by.text('CustomLongCustomText')).tap();
      await element(by.text('Open screen')).tap();
      await expect(element(by.text('Back'))).toBeVisible();
      await expectBackButtonMenuWithDifferentLabels('Back', 'LongLongLongLongLong'); // Check if backButtonMenu works
      await element(by.text('Pop to top')).tap(); // Go back
   });

   // TODO: We should be able to fix that
   // Custom text overrides backButtonDisplayMode because of using backButtonItem
   it.failing('Custom back label should be truncated to minimal by buckButtonDisplayMode when title is long', async () => {
      await element(by.text('CustomCustomTextWithLongTitle')).tap();
      await element(by.text('Open screen')).tap();
      await expect(element(by.id('chevron.backward'))).toBeVisible();
      await expect(element(by.text('CustomBack'))).not.toBeVisible();
      await expectBackButtonMenuIconAndLabel('chevron.backward', 'CustomBack'); // Check if backButtonMenu works
      await element(by.text('Pop to top')).tap(); // Go back
   });
});
