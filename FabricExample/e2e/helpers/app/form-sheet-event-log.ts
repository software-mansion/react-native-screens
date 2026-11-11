import { expect, element, by, waitFor } from 'detox';
import { expect as jestExpect } from '@jest/globals';
import {
  expectDimmingIfIOS,
  expectNoDimmingIfIOS,
} from '@e2e/framework/form-sheet';
import { getMatches } from '@e2e/framework/matchers';
import { waitUntil } from '@e2e/framework/wait';

// Helpers for the FormSheet event screens (`test-form-sheet-dismiss-events`,
// `test-form-sheet-lifecycle-events`), which share these testIDs and keep a
// `[HH:MM:SS.mmm] <eventName>` log.

/**
 * Event names currently in the log, oldest first, with the timestamp prefix
 * stripped. Empty when nothing has been logged yet.
 */
export async function readEventLog(): Promise<string[]> {
  const matches = await getMatches(by.id('event-logs-container-text'), {
    orEmpty: true,
  });
  // RN `Text` value is reported as `label` on iOS and `text` on Android.
  return matches.map(attrs =>
    (attrs.text ?? attrs.label ?? '').replace(/^\[[^\]]*\]\s*/, '').trim(),
  );
}

/**
 * Asserts the log holds exactly `expected`, oldest first. Waits for the last
 * entry to land, so a transition still running is not a failure.
 */
export async function expectEventLog(expected: string[]) {
  let logs: string[] = [];
  await waitUntil(
    async () => {
      logs = await readEventLog();
      return logs.length >= expected.length;
    },
    {
      message: () =>
        `expected event log [${expected.join(', ')}], got [${logs.join(', ')}]`,
    },
  );
  jestExpect(logs).toEqual(expected);
}

export async function expectEmptyEventLog() {
  await expect(
    element(
      by
        .id('empty-event-logs-container-text')
        .and(by.text('No events recorded yet.')),
    ),
  ).toBeVisible();
}

export async function clearEventLog() {
  await element(by.id('clear-logs-button')).tap();
  await expectEmptyEventLog();
}

export async function openFormSheet() {
  await element(by.id('open-formsheet-button')).tap();
  await waitFor(element(by.id('formsheet-base-content')))
    .toBeVisible()
    .withTimeout(3000);
  await expectDimmingIfIOS();
}

export async function expectFormSheetDismissed() {
  await waitFor(element(by.id('formsheet-base-content')))
    .not.toExist()
    .withTimeout(3000);
  await expectNoDimmingIfIOS();
}
