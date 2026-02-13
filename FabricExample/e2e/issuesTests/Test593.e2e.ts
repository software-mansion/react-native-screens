import { device, expect, element, by } from 'detox';
import { selectIssueTestScreen } from '../e2e-utils';

const awaitValidEventBehavior = async () => {
  await expect(
    element(by.text('3. Status | transitionStart | closing')),
  ).toExist();
  await expect(
    element(by.text('4. Deeper | transitionStart | opening')),
  ).toExist();
  await expect(
    element(by.text('5. Privacy | transitionStart | opening')),
  ).toExist();
  await expect(
    element(by.text('6. Status | transitionEnd | closing')),
  ).toExist();
  await expect(
    element(by.text('7. Deeper | transitionEnd | opening')),
  ).toExist();
  await expect(
    element(by.text('8. Privacy | transitionEnd | opening')),
  ).toExist();
  await expect(
    element(by.text('9. Privacy | transitionStart | closing')),
  ).toExist();
  await expect(
    element(by.text('10. Another | transitionStart | opening')),
  ).toExist();
  await expect(
    element(by.text('11. Privacy | transitionEnd | closing')),
  ).toExist();
  await expect(
    element(by.text('12. Another | transitionEnd | opening')),
  ).toExist();
  if (device.getPlatform() === 'ios') {
    await expect(
      element(by.text('13. Deeper | transitionStart | closing')),
    ).toExist();
    await expect(
      element(by.text('14. Another | transitionStart | closing')),
    ).toExist();
    await expect(
      element(by.text('15. Status | transitionStart | opening')),
    ).toExist();
    await expect(
      element(by.text('16. Deeper | transitionEnd | closing')),
    ).toExist();
    await expect(
      element(by.text('17. Another | transitionEnd | closing')),
    ).toExist();
    await expect(
      element(by.text('18. Status | transitionEnd | opening')),
    ).toExist();
  } else {
    await expect(
      element(by.text('13. Status | transitionStart | opening')),
    ).toExist();
    await expect(
      element(by.text('14. Status | transitionEnd | opening')),
    ).toExist();
  }
};

describe('Test593', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await selectIssueTestScreen('Test593');
  });

  it('should run transitionStart & transitionEnd opening events', async () => {
    await expect(
      element(by.text('1. Status | transitionStart | opening')),
    ).toExist();
    await expect(
      element(by.text('2. Status | transitionEnd | opening')),
    ).toExist();
  });

  it('should go back from screen in nested stack and run opening & closing events in correct order', async () => {
    await element(by.id('status-button-go-to-deeper')).tap();
    await element(by.id('privacy-button-go-to-another')).tap();

    if (device.getPlatform() === 'ios') {
      await element(by.type('_UIButtonBarButton')).atIndex(0).tap();
    } else {
      await element(by.type('androidx.appcompat.widget.AppCompatImageButton'))
        .atIndex(0)
        .tap();
    }

    await awaitValidEventBehavior();
  });

  it('should use "none" animation, go back from screen in nested stack and run opening & closing events in correct order', async () => {
    await element(by.id('Test593-stack-animation-picker')).tap();
    await element(by.id('stack-animation-none')).tap();

    await element(by.id('status-button-go-to-deeper')).tap();
    await element(by.id('privacy-button-go-to-another')).tap();

    if (device.getPlatform() === 'ios') {
      await element(by.type('_UIButtonBarButton')).atIndex(0).tap();
    } else {
      await element(by.type('androidx.appcompat.widget.AppCompatImageButton'))
        .atIndex(0)
        .tap();
    }

    await awaitValidEventBehavior();
  });
});
