import { device, expect, element, by } from 'detox';
import { selectSingleFeatureTestsScreen } from '../../e2e-utils';

async function dismissToast(message: string) {
  await waitFor(element(by.label(message)))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.label(message)).tap();
}

// These scenarios are split into two separate suites using `device.reloadReactNative()`.
// Running these scenarios sequentially within a single app lifecycle caused deterministic
// failures in Detox that do not occur during manual testing.
//
// Incorrect behavior in Detox manifests as follows:
// 1. If starting with `true` (Toast appears), switching to `false` fails to
//    auto-select the Third tab after the heavy render; Second remains selected.
// 2. If starting with `false` (Third is selected), switching to `true` fails
//    to trigger the rejection Toast.
//
// To ensure both logic paths are verified correctly, the tests are divided into
// separate runs with a full JS reload in between. No further effort was made
// to fix these runtime state transitions in Detox.

describe('Stale update rejection - rejectStaleNavStateUpdates:true', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-stale-update-rejection',
    );
  });

  it('should display First tab with correct initial state', async () => {
    await expect(element(by.id('First-route-key-label'))).toBeVisible();
    await expect(element(by.id('First-heavy-render-label'))).toHaveText(
      'heavyRender: false',
    );
    await expect(element(by.id('First-reject-stale-label'))).toHaveText(
      'rejectStaleNavStateUpdates: true',
    );
  });

  it('should navigate to Third tab and enable heavyRender', async () => {
    await element(by.label('stale-rejection-tab-third-label')).tap();

    await waitFor(element(by.id('Third-route-key-label')))
      .toHaveLabel('Third')
      .withTimeout(3000);

    await expect(element(by.id('Third-heavy-render-label'))).toHaveText(
      'heavyRender: false',
    );

    await element(by.id('Third-toggle-heavy-render')).tap();

    await waitFor(element(by.id('Third-heavy-render-label')))
      .toHaveText('heavyRender: true')
      .withTimeout(6000);
  });

  it('should fire onTabSelectionRejected toast', async () => {
    await waitFor(element(by.id('Third-reject-stale-label')))
      .toHaveText('rejectStaleNavStateUpdates: true')
      .withTimeout(3000);

    await element(by.label('stale-rejection-tab-first-label')).tap();
    await waitFor(element(by.id('First-route-key-label')))
      .toHaveLabel('First')
      .withTimeout(6000);

    await device.disableSynchronization();
    try {
      await element(by.id('First-select-third')).tap();

      await element(by.label('stale-rejection-tab-second-label')).tap();
    } finally {
      await device.enableSynchronization();
    }
    await waitFor(element(by.label('1. onTabSelectionRejected: Third')))
      .toBeVisible()
      .withTimeout(20000);

    await dismissToast('1. onTabSelectionRejected: Third');

    await expect(element(by.id('Second-route-key-label'))).toBeVisible();
  });
});

describe('Stale update rejection - rejectStaleNavStateUpdates:false', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
    await selectSingleFeatureTestsScreen(
      'Tabs',
      'test-tabs-stale-update-rejection',
    );
  });

  it('should navigate to Third tab, enable heavyRender and disable rejectStaleNavStateUpdates', async () => {
    await element(by.label('stale-rejection-tab-third-label')).tap();

    await waitFor(element(by.id('Third-route-key-label')))
      .toHaveLabel('Third')
      .withTimeout(3000);

    await expect(element(by.id('Third-heavy-render-label'))).toHaveText(
      'heavyRender: false',
    );

    await element(by.id('Third-toggle-heavy-render')).tap();

    await waitFor(element(by.id('Third-heavy-render-label')))
      .toHaveText('heavyRender: true')
      .withTimeout(6000);

    await expect(element(by.id('Third-reject-stale-label'))).toHaveText(
      'rejectStaleNavStateUpdates: true',
    );
    await element(by.id('Third-toggle-reject-stale')).tap();

    await waitFor(element(by.id('Third-reject-stale-label')))
      .toHaveText('rejectStaleNavStateUpdates: false')
      .withTimeout(6000);
  });

  it('should NOT fire onTabSelectionRejected', async () => {
    await waitFor(element(by.id('Third-reject-stale-label')))
      .toHaveText('rejectStaleNavStateUpdates: false')
      .withTimeout(3000);

    await element(by.label('stale-rejection-tab-first-label')).tap();
    await waitFor(element(by.id('First-route-key-label')))
      .toHaveLabel('First')
      .withTimeout(3000);

    await device.disableSynchronization();
    try {
      await element(by.id('First-select-third')).tap();

      await element(by.label('stale-rejection-tab-second-label')).tap();
    } finally {
      await device.enableSynchronization();
    }
    await waitFor(element(by.label('1. onTabSelectionRejected: Third')))
      .not.toBeVisible()
      .withTimeout(8000);

    await waitFor(element(by.id('Third-route-key-label')))
      .toHaveLabel('Third')
      .withTimeout(8000);
  });
});
