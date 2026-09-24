import { expect as jestExpect } from '@jest/globals';
import { by, device, element, waitFor } from 'detox';
import type { AndroidElementAttributes } from 'detox/detox';
import type { ProbeSnapshot } from '@apps/tests/single-feature-tests/stack-v5/test-stack-nested-scroll-interop-android';
import {
  describeIfAndroid,
  getElementAttributes,
  getMatches,
  getTopmostMatch,
  selectSingleFeatureTestsScreen,
  waitUntil,
} from '../../e2e-utils';
import {
  CLASS_NAME_ANDROID_APP_BAR_LAYOUT,
  CLASS_NAME_ANDROID_MATERIAL_TOOLBAR,
} from '../../native-class-names';

type ProbeScreen = 'home' | 'details' | 'nested';

const toolbar = by.type(CLASS_NAME_ANDROID_MATERIAL_TOOLBAR);
const appBar = by.type(CLASS_NAME_ANDROID_APP_BAR_LAYOUT).withDescendant(toolbar);

const SCROLL_STEP_DP = 500;
const SCROLL_ANCHOR_Y = 0.85;
const SWIPE_OFFSET = 0.55;
const SWIPE_START_X = 0.5;
const SWIPE_UP_START_Y = 0.85;
const SWIPE_DOWN_START_Y = 0.2;
const REVERSE_SWIPE_OFFSET = 0.35;

let lastSnapshotSequence = 0;

function probeId(screen: ProbeScreen, suffix: string) {
  return `nested-scroll-probe-${screen}-${suffix}`;
}

async function appBarAttributes(): Promise<AndroidElementAttributes> {
  const matches = await getMatches(appBar);
  jestExpect(matches).toHaveLength(1);
  return matches[0] as AndroidElementAttributes;
}

async function topmostAppBarAttributes(): Promise<AndroidElementAttributes> {
  return (await getTopmostMatch(appBar)) as AndroidElementAttributes;
}

async function readSnapshot(screen: ProbeScreen): Promise<ProbeSnapshot> {
  await element(by.id(probeId(screen, 'snapshot-button'))).tap();

  let snapshot: ProbeSnapshot | null = null;
  await waitUntil(
    async () => {
      const attributes = (await getElementAttributes({
        by: 'id',
        value: probeId(screen, 'snapshot'),
      })) as AndroidElementAttributes;
      const text = attributes.text;
      if (text == null || text === 'none') return false;

      const parsed = JSON.parse(text) as ProbeSnapshot;
      if (parsed.sequence <= lastSnapshotSequence) return false;

      snapshot = parsed;
      return true;
    },
    {
      timeout: 3000,
      message: () =>
        `expected a probe snapshot newer than sequence ${lastSnapshotSequence}`,
    },
  );

  jestExpect(snapshot).not.toBeNull();
  lastSnapshotSequence = snapshot!.sequence;
  return snapshot!;
}

async function setMode(
  screen: ProbeScreen,
  mode: 'observe' | 'consume' | 'disabled',
) {
  const suffix = mode === 'disabled' ? 'disable' : mode;
  await element(by.id(probeId(screen, suffix))).tap();
  await waitFor(element(by.id(probeId(screen, 'mode'))))
    .toHaveText(mode)
    .withTimeout(3000);
}

async function resetProbe(screen: ProbeScreen) {
  await element(by.id(probeId(screen, 'reset'))).tap();
  await waitFor(element(by.id(probeId(screen, 'snapshot'))))
    .toHaveText('none')
    .withTimeout(3000);
}

async function waitForScreen(screen: ProbeScreen, label: string) {
  await waitFor(element(by.id(probeId(screen, 'route'))))
    .toHaveText(label)
    .withTimeout(5000);
}

async function scrollToTop(screen: ProbeScreen) {
  await element(by.id(probeId(screen, 'scrollview'))).scrollTo('top');
  await waitFor(element(by.id(probeId(screen, 'top'))))
    .toBeVisible()
    .withTimeout(3000);
}

async function scrollAwayFromTop(screen: ProbeScreen) {
  await element(by.id(probeId(screen, 'scrollview'))).scroll(
    SCROLL_STEP_DP,
    'down',
    Number.NaN,
    SCROLL_ANCHOR_Y,
  );
}

async function swipeUpFromSafeAnchor(
  screen: ProbeScreen,
  speed: 'fast' | 'slow',
  offset = SWIPE_OFFSET,
) {
  await element(by.id(probeId(screen, 'scrollview'))).swipe(
    'up',
    speed,
    offset,
    SWIPE_START_X,
    SWIPE_UP_START_Y,
  );
}

async function swipeDownFromSafeAnchor(
  screen: ProbeScreen,
  speed: 'fast' | 'slow',
  offset = REVERSE_SWIPE_OFFSET,
) {
  await element(by.id(probeId(screen, 'scrollview'))).swipe(
    'down',
    speed,
    offset,
    SWIPE_START_X,
    SWIPE_DOWN_START_Y,
  );
}

async function waitForAdditionalAppBar(previousCount: number) {
  await waitUntil(
    async () => {
      const matches = await getMatches(appBar, { orEmpty: true });
      return matches.length > previousCount;
    },
    {
      timeout: 5000,
      message: () =>
        'expected the pushed Stack v5 screen to attach its AppBarLayout',
    },
  );
}

function totalConsumedY(snapshot: ProbeSnapshot) {
  return snapshot.delegateConsumedPreY + snapshot.delegateConsumedPostY;
}

describeIfAndroid('Stack v5: nested-scroll interop seam (Android)', () => {
  beforeEach(async () => {
    lastSnapshotSequence = 0;
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Stackv5',
      'test-stack-nested-scroll-interop-android',
    );
    await waitForScreen('home', 'Home');
    await waitFor(element(by.id(probeId('home', 'scrollview'))))
      .toBeVisible()
      .withTimeout(5000);
    await waitFor(element(toolbar)).toBeVisible().withTimeout(5000);
  });

  it('forwards the real Stack v5 touch transaction without consuming it', async () => {
    await setMode('home', 'observe');
    await scrollToTop('home');

    // Collapse enough native chrome to make the ScrollView a valid Detox swipe target,
    // then isolate the transaction we actually want to inspect.
    await scrollAwayFromTop('home');
    await resetProbe('home');
    await swipeUpFromSafeAnchor('home', 'fast');

    const snapshot = await readSnapshot('home');
    jestExpect(snapshot.lastScreenClass).toBe(
      'com.swmansion.rnscreens.stack.screen.StackScreen',
    );
    jestExpect(snapshot.lastTargetClass).toContain('ReactScrollView');
    jestExpect(snapshot.touchStarts).toBeGreaterThan(0);
    jestExpect(snapshot.touchPre + snapshot.touchPost).toBeGreaterThan(0);
    jestExpect(snapshot.delegateConsumedPreY).toBe(0);
    jestExpect(snapshot.delegateConsumedPostY).toBe(0);
    jestExpect(snapshot.lastTargetScrollY).toBeGreaterThan(0);
  });

  it('keeps Stack v5 first and lets the delegate consume only the remaining distance', async () => {
    await scrollToTop('home');
    const expandedFrame = (await appBarAttributes()).frame;

    await setMode('home', 'consume');
    await scrollAwayFromTop('home');

    const snapshot = await readSnapshot('home');
    const collapsedFrame = (await appBarAttributes()).frame;
    jestExpect(Math.abs(totalConsumedY(snapshot))).toBeGreaterThan(0);
    jestExpect(snapshot.lastTargetScrollY).toBe(0);
    jestExpect(collapsedFrame.y).toBeLessThan(expandedFrame.y);
  });

  it('switches to the pushed screen source and restores the original source on pop', async () => {
    await setMode('home', 'observe');
    await scrollToTop('home');
    await scrollAwayFromTop('home');
    const home = await readSnapshot('home');

    await element(by.id(probeId('home', 'push'))).tap();
    await waitForScreen('details', 'Details');
    await scrollAwayFromTop('details');
    const details = await readSnapshot('details');

    jestExpect(details.lastScreenId).not.toBe(home.lastScreenId);
    jestExpect(details.lastTargetId).not.toBe(home.lastTargetId);

    await element(by.id(probeId('details', 'pop'))).tap();
    await waitForScreen('home', 'Home');
    await scrollAwayFromTop('home');
    const restoredHome = await readSnapshot('home');

    jestExpect(restoredHome.lastScreenId).toBe(home.lastScreenId);
    jestExpect(restoredHome.lastTargetId).toBe(home.lastTargetId);
  });

  it('preserves an outer Stack v5 header when the delegate accepts an inner stack source', async () => {
    await setMode('home', 'observe');
    await scrollToTop('home');
    const appBarCountBeforePush = (
      await getMatches(appBar, { orEmpty: true })
    ).length;

    await element(by.id(probeId('home', 'push-nested'))).tap();
    await waitForScreen('nested', 'Nested');
    await waitForAdditionalAppBar(appBarCountBeforePush);

    await scrollToTop('nested');
    const expandedFrame = (await topmostAppBarAttributes()).frame;
    await scrollAwayFromTop('nested');

    const snapshot = await readSnapshot('nested');
    const collapsedFrame = (await topmostAppBarAttributes()).frame;
    jestExpect(snapshot.lastScreenClass).toBe(
      'com.swmansion.rnscreens.stack.screen.StackScreen',
    );
    jestExpect(snapshot.lastTargetClass).toContain('ReactScrollView');
    jestExpect(snapshot.touchStarts).toBeGreaterThan(0);
    jestExpect(totalConsumedY(snapshot)).toBe(0);
    jestExpect(snapshot.lastTargetScrollY).toBeGreaterThan(0);
    jestExpect(collapsedFrame.y).toBeLessThan(expandedFrame.y);
  });

  it('keeps the outer ancestor first before an inner delegate consumes the remainder', async () => {
    await scrollToTop('home');
    const appBarCountBeforePush = (
      await getMatches(appBar, { orEmpty: true })
    ).length;

    await element(by.id(probeId('home', 'push-nested'))).tap();
    await waitForScreen('nested', 'Nested');
    await waitForAdditionalAppBar(appBarCountBeforePush);
    await setMode('nested', 'consume');
    await scrollToTop('nested');

    const expandedFrame = (await topmostAppBarAttributes()).frame;
    await scrollAwayFromTop('nested');

    const snapshot = await readSnapshot('nested');
    const collapsedFrame = (await topmostAppBarAttributes()).frame;
    jestExpect(totalConsumedY(snapshot)).toBeGreaterThan(0);
    jestExpect(snapshot.lastTargetScrollY).toBe(0);
    jestExpect(collapsedFrame.y).toBeLessThan(expandedFrame.y);
  });

  it('clamps signed delegate consumption correctly when scroll direction reverses', async () => {
    await setMode('home', 'consume');
    await scrollToTop('home');

    // Warm up with Detox scroll() only to expose the target, then use real swipes for the
    // forward/reverse transactions whose signed consumption we assert.
    await scrollAwayFromTop('home');
    await resetProbe('home');
    await swipeUpFromSafeAnchor('home', 'slow');

    const forward = await readSnapshot('home');
    const collapsedFrame = (await appBarAttributes()).frame;
    jestExpect(totalConsumedY(forward)).toBeGreaterThan(0);

    await resetProbe('home');
    await swipeDownFromSafeAnchor('home', 'slow');

    const reverse = await readSnapshot('home');
    const expandedFrame = (await appBarAttributes()).frame;
    jestExpect(totalConsumedY(reverse)).toBeLessThan(0);
    jestExpect(reverse.lastTargetScrollY).toBe(forward.lastTargetScrollY);
    jestExpect(expandedFrame.y).toBeGreaterThan(collapsedFrame.y);
  });

  it('keeps TOUCH and NON_TOUCH lifecycle independent when a new TOUCH starts during NON_TOUCH', async () => {
    await setMode('home', 'observe');
    await resetProbe('home');

    await element(by.id(probeId('home', 'interleave'))).tap();

    let interleaveStatus = 'idle';
    await waitUntil(
      async () => {
        const attributes = (await getElementAttributes({
          by: 'id',
          value: probeId('home', 'interleave-status'),
        })) as AndroidElementAttributes;
        interleaveStatus = attributes.text ?? 'missing-status';
        return interleaveStatus !== 'idle';
      },
      {
        timeout: 3000,
        message: () =>
          `expected interleaved lifecycle dispatch to finish; last status: ${interleaveStatus}`,
      },
    );
    jestExpect(interleaveStatus).toBe('done');

    const snapshot = await readSnapshot('home');
    jestExpect(snapshot.lastTargetClass).toContain('ReactScrollView');
    jestExpect(snapshot.touchStarts).toBe(2);
    jestExpect(snapshot.touchStops).toBe(2);
    jestExpect(snapshot.nonTouchStarts).toBe(1);
    jestExpect(snapshot.nonTouchStops).toBe(1);
    jestExpect(snapshot.lifecycleTrace).toEqual([
      'start:touch',
      'stop:touch',
      'start:nonTouch',
      'start:touch',
      'stop:touch',
      'stop:nonTouch',
    ]);
  });

  it('is behaviorally inert when the external delegate declines nested scroll', async () => {
    await scrollToTop('home');
    const expandedFrame = (await appBarAttributes()).frame;
    await setMode('home', 'disabled');

    await scrollAwayFromTop('home');
    await scrollAwayFromTop('home');

    const snapshot = await readSnapshot('home');
    const collapsedFrame = (await appBarAttributes()).frame;
    jestExpect(snapshot.touchStarts).toBe(0);
    jestExpect(snapshot.nonTouchStarts).toBe(0);
    jestExpect(snapshot.touchPre).toBe(0);
    jestExpect(snapshot.nonTouchPre).toBe(0);
    jestExpect(snapshot.touchPost).toBe(0);
    jestExpect(snapshot.nonTouchPost).toBe(0);
    jestExpect(totalConsumedY(snapshot)).toBe(0);
    jestExpect(collapsedFrame.y).toBeLessThan(expandedFrame.y);
  });

  it('preserves stock Stack v5 behavior when no delegate factory is installed', async () => {
    await setMode('home', 'observe');
    await scrollToTop('home');
    await element(by.id(probeId('home', 'remove-factory'))).tap();
    await waitFor(element(by.id(probeId('home', 'factory'))))
      .toHaveText('absent')
      .withTimeout(3000);

    await element(by.id(probeId('home', 'push'))).tap();
    await waitForScreen('details', 'Details');
    await scrollToTop('details');
    const expandedFrame = (await topmostAppBarAttributes()).frame;

    await scrollAwayFromTop('details');
    await scrollAwayFromTop('details');

    const snapshot = await readSnapshot('details');
    const collapsedFrame = (await topmostAppBarAttributes()).frame;
    jestExpect(snapshot.delegatesCreated).toBe(0);
    jestExpect(snapshot.touchStarts).toBe(0);
    jestExpect(snapshot.nonTouchStarts).toBe(0);
    jestExpect(collapsedFrame.y).toBeLessThan(expandedFrame.y);
  });
});
