import { device, expect, element, by } from 'detox';
import { selectIssueTestScreen } from '@e2e/app/test-screen-navigation';
import {
  expectHeaderViewShown,
  tapHeaderView,
} from '@e2e/framework/header-items-ios';
import { getFrame, getMatches } from '@e2e/framework/matchers';
import { CLASS_NAME_RNS_SCREEN_VIEW } from '@e2e/framework/native-classes-ios';
import { describeIfIOS, isIOSVersionAtLeast } from '@e2e/framework/platform';

const HEADER_RIGHT = by.id('subview-headerright');

/**
 * Slow, short swipe right starting near the left edge of the headerRight
 * subview. On iOS 27 the header subview is not hittable for Detox (see
 * header-items-ios.ts), so the swipe is performed on the modal's screen view
 * (which spans the header) from the subview's position instead.
 */
async function swipeHeaderRightSlightly() {
  const startXFraction = 0.1;
  const offsetFraction = 0.15;

  if (!isIOSVersionAtLeast('27.0')) {
    await element(HEADER_RIGHT).swipe(
      'right',
      'slow',
      offsetFraction,
      startXFraction,
      0.5,
    );
    return;
  }

  const hostMatcher = by
    .type(CLASS_NAME_RNS_SCREEN_VIEW)
    .withDescendant(by.id('modal-button-close'));
  const target = await getFrame(HEADER_RIGHT, 'headerRight subview');
  const startX = target.x + target.width * startXFraction;
  const startY = target.y + target.height / 2;

  // More than one screen view matches; swipe on the innermost one spanning the
  // swipe start point.
  const hosts = (await getMatches(hostMatcher))
    .map(({ frame }, index) => ({ frame, index }))
    .filter(
      ({ frame }) =>
        startX >= frame.x &&
        startX <= frame.x + frame.width &&
        startY >= frame.y &&
        startY <= frame.y + frame.height,
    )
    .sort(
      (a, b) => a.frame.width * a.frame.height - b.frame.width * b.frame.height,
    );
  if (hosts.length === 0) {
    throw new Error('No modal screen view spans the headerRight subview.');
  }
  const { frame: host, index } = hosts[0];

  await element(hostMatcher)
    .atIndex(index)
    .swipe(
      'right',
      'slow',
      (offsetFraction * target.width) / host.width,
      (startX - host.x) / host.width,
      (startY - host.y) / host.height,
    );
}

describeIfIOS('Test2842 - pressables in modal', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  it('Test2842 should exist', async () => {
    await selectIssueTestScreen('Test2842');
  });

  it('Modal should open', async () => {
    const openModalButtonElement = element(by.id('home-button-open-modal'));
    await expect(openModalButtonElement).toExist();
    await openModalButtonElement.tap();

    // Verify that the modal has opened by checking that the "close" button is visible
    const closeModalButtonElement = element(by.id('modal-button-close'));
    await expect(closeModalButtonElement).toBeVisible();
  });

  it('HeaderRight subview should be visible', async () => {
    await expectHeaderViewShown(HEADER_RIGHT, 100);
  });

  it('HeaderRight should be pressable', async () => {
    await tapHeaderView(HEADER_RIGHT);

    // These are rendered under the modal, therefore they are not visible at the first glance.
    await expect(element(by.text('1. onPressIn'))).toExist();
    await expect(element(by.text('2. onPress'))).toExist();
    await expect(element(by.text('3. onPressOut'))).toExist();
  });

  it('HeaderRight should not lose focus on swipe', async () => {
    await swipeHeaderRightSlightly();

    // If the element has lost focus, it wouldn't fire onPress.
    // Note that when swiping the event order is different - but this is RN behaviour.
    await expect(element(by.text('4. onPressIn'))).toExist();
    await expect(element(by.text('5. onPressOut'))).toExist();
    await expect(element(by.text('6. onPress'))).toExist();
  });
});
