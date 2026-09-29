import { expect, element, by } from 'detox';
import {
  rewindAndScrollUntilVisible,
  type ScrollTargetOptions,
} from '@e2e/framework/gestures';

// Assertions over the `<Label>: <value>` readouts our test screens render.

/** Asserts the toolbar-menu screens' `Last clicked: <id>` line. */
export async function expectLastClicked(
  id: string,
  { scrollViewId, ...scroll }: ScrollTargetOptions,
) {
  await rewindAndScrollUntilVisible('last-clicked-text', scrollViewId, scroll);
  await expect(element(by.id('last-clicked-text'))).toHaveText(
    `Last clicked: ${id}`,
  );
}
