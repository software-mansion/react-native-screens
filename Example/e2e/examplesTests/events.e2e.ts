import { device, expect, element, by } from 'detox';

describe('Events', () => {
  beforeEach(async () => {
    await device.reloadReactNative();

    await waitFor(element(by.id('root-screen-playground-Events')))
      .toBeVisible()
      .whileElement(by.id('root-screen-examples-scrollview'))
      .scroll(200, 'down');
  });

  it('should Events playground exist', async () => {
    await expect(element(by.id('root-screen-playground-Events'))).toBeVisible();
    element(by.id('root-screen-playground-Events')).tap();
  });

  it('should run transitionStart & transitionEnd opening events', async () => {
    await element(by.id('root-screen-playground-Events')).tap();

    await expect(
      element(by.text('1. Main | transitionStart | opening'))
    ).toExist();
    await expect(
      element(by.text('2. Main | transitionEnd | opening'))
    ).toExist();
  });

  it('should go back from Chats using header button and run opening & closing events in correct order ', async () => {
    await element(by.id('root-screen-playground-Events')).tap();

    await element(by.id('events-go-to-chats')).tap();
    if (device.getPlatform() === 'ios') {
      await element(by.type('_UIButtonBarButton')).tap();
    } else {
      await element(
        by.type('androidx.appcompat.widget.AppCompatImageButton')
      ).tap();
    }

    await expect(
      element(by.text('9. Chats | transitionStart | closing'))
    ).toExist();
    await expect(
      element(by.text('10. Privacy | transitionStart | closing'))
    ).toExist();
    await expect(
      element(by.text('11. Main | transitionStart | opening'))
    ).toExist();
    await expect(
      element(by.text('12. Chats | transitionEnd | closing'))
    ).toExist();
    await expect(
      element(by.text('13. Privacy | transitionEnd | closing'))
    ).toExist();
    await expect(
      element(by.text('14. Main | transitionEnd | opening'))
    ).toExist();
  });

  it('should use "none" animation, go back from Chats using header button and run opening & closing events in correct order ', async () => {
    await element(by.id('root-screen-playground-Events')).tap();

    await element(by.id('events-stack-animation-picker')).tap();
    await element(by.id('stack-animation-none')).tap();

    await element(by.id('events-go-to-chats')).tap();

    if (device.getPlatform() === 'ios') {
      await element(by.type('_UIButtonBarButton')).tap();
    } else {
      await element(
        by.type('androidx.appcompat.widget.AppCompatImageButton')
      ).tap();
    }

    await expect(
      element(by.text('9. Chats | transitionStart | closing'))
    ).toExist();
    await expect(
      element(by.text('10. Privacy | transitionStart | closing'))
    ).toExist();
    await expect(
      element(by.text('11. Main | transitionStart | opening'))
    ).toExist();
    await expect(
      element(by.text('12. Chats | transitionEnd | closing'))
    ).toExist();
    await expect(
      element(by.text('13. Privacy | transitionEnd | closing'))
    ).toExist();
    await expect(
      element(by.text('14. Main | transitionEnd | opening'))
    ).toExist();
  });

  it('should use "slide_from_bottom" animation, go to Chats and run opening & closing events in correct order ', async () => {
    await element(by.id('root-screen-playground-Events')).tap();

    await element(by.id('events-stack-animation-picker')).tap();
    await element(by.id('stack-animation-slide_from_bottom')).tap();

    await element(by.id('events-go-to-chats')).tap();

    await expect(
      element(by.text('3. Main | transitionStart | closing'))
    ).toExist();
    await expect(
      element(by.text('4. Chats | transitionStart | opening'))
    ).toExist();
    await expect(
      element(by.text('5. Privacy | transitionStart | opening'))
    ).toExist();
    await expect(
      element(by.text('6. Main | transitionEnd | closing'))
    ).toExist();
    await expect(
      element(by.text('7. Chats | transitionEnd | opening'))
    ).toExist();
    await expect(
      element(by.text('8. Privacy | transitionEnd | opening'))
    ).toExist();
  });

  it('should use "slide_from_bottom" animation, go back from Chats using header button and run opening & closing events in correct order ', async () => {
    await element(by.id('root-screen-playground-Events')).tap();

    await element(by.id('events-stack-animation-picker')).tap();
    await element(by.id('stack-animation-slide_from_bottom')).tap();

    await element(by.id('events-go-to-chats')).tap();

    if (device.getPlatform() === 'ios') {
      await element(by.type('_UIButtonBarButton')).tap();
    } else {
      await element(
        by.type('androidx.appcompat.widget.AppCompatImageButton')
      ).tap();
    }

    await expect(
      element(by.text('9. Chats | transitionStart | closing'))
    ).toExist();
    await expect(
      element(by.text('10. Privacy | transitionStart | closing'))
    ).toExist();
    await expect(
      element(by.text('11. Main | transitionStart | opening'))
    ).toExist();
    await expect(
      element(by.text('12. Chats | transitionEnd | closing'))
    ).toExist();
    await expect(
      element(by.text('13. Privacy | transitionEnd | closing'))
    ).toExist();
    await expect(
      element(by.text('14. Main | transitionEnd | opening'))
    ).toExist();
  });

  it('[Android] should go back from Chats using native way and run opening & closing events in correct order ', async () => {
    // swipe to go back doesn't seem to work on iOS
    if (device.getPlatform() !== 'android') return;

    await element(by.id('root-screen-playground-Events')).tap();

    await element(by.id('events-go-to-chats')).tap();

    await device.pressBack();

    await expect(
      element(by.text('9. Main | transitionStart | opening'))
    ).toExist();
    await expect(
      element(by.text('10. Main | transitionEnd | opening'))
    ).toExist();
  });

  it('[Android] should use "none" animation, go back from Chats using native way and run opening & closing events in correct order ', async () => {
    // swipe to go back doesn't seem to work on iOS
    if (device.getPlatform() !== 'android') return;

    await element(by.id('root-screen-playground-Events')).tap();

    await element(by.id('events-stack-animation-picker')).tap();
    await element(by.id('stack-animation-none')).tap();

    await element(by.id('events-go-to-chats')).tap();

    await device.pressBack();

    await expect(
      element(by.text('9. Main | transitionStart | opening'))
    ).toExist();
    await expect(
      element(by.text('10. Main | transitionEnd | opening'))
    ).toExist();
  });

  it('[Android] should use "slide_from_bottom" animation, go back from Chats using native way and run opening & closing events in correct order ', async () => {
    // swipe to go back doesn't seem to work on iOS
    if (device.getPlatform() !== 'android') return;

    await element(by.id('root-screen-playground-Events')).tap();

    await element(by.id('events-stack-animation-picker')).tap();
    await element(by.id('stack-animation-slide_from_bottom')).tap();

    await element(by.id('events-go-to-chats')).tap();

    await device.pressBack();

    await expect(
      element(by.text('9. Main | transitionStart | opening'))
    ).toExist();
    await expect(
      element(by.text('10. Main | transitionEnd | opening'))
    ).toExist();
  });
});
