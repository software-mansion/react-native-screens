# Test Scenario: Suspense container restoration

## Details

**Description:** Verifies that Android restores the native tabs container after
the selected tab suspends. Selecting **Team** renders content that suspends for
three seconds. The tabs container is wrapped in a React Native view with the
without `collapsable={false}` because that layout-only wrapper is required to trigger
the failing reconciliation path. Because the Suspense boundary wraps both
views, React replaces them with the fallback and then reattaches them when
loading finishes.

**OS test creation version:** Android: API Level 36.

## E2E test

Incomplete: This scenario is not covered by an E2E test.

## Prerequisites

- Android emulator or device

## Steps

1. Launch the app and navigate to **Suspense container restoration**.

- [ ] The **Catalog** tab is selected and the Catalog content is visible.

2. Tap the **Team** tab.

- [ ] The tabs container is replaced with the **Loading Team…** fallback.
- [ ] The app does not crash with an unexpected fragment manager state error.

3. Wait for three seconds.

- [ ] The tabs container reappears with **Team** selected.
- [ ] The content displays **Team loaded**.

4. Switch between **Catalog** and **Team**.

- [ ] Both tabs remain usable and the app does not crash.
