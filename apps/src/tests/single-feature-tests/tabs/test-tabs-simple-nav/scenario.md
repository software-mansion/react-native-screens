# Test Scenario: Simple navigation

## Details

**Description:** Verifies that programmatic tab navigation via the
`selectTab` method on `useTabsNavigationContext` works correctly.
Each tab renders its own `routeKey` as a label and exposes three
buttons - **Select First**, **Select Second**, **Select Third** -
that call `selectTab` with the corresponding route key. The test
validates that tapping the tab bar items navigates normally, that
the programmatic `selectTab` buttons switch to the correct tab
from any starting tab, that the displayed `routeKey` label always
matches the active tab, and that both interaction paths are
consistent across platforms.

**OS test creation version:** iOS: 18.6 and 26.5, Android: API Level 36.

## E2E test

Incomplete: The E2E test covers steps 1-13. Step 14 is omitted because Detox
automatically waits for the UI layer to become idle. Due to this synchronization
model, it cannot execute rapid tab switching sequentially before the previous
transition animation finishes.

## Prerequisites

- iOS device or simulator
- Android emulator or device

## Steps

### Baseline

1. Launch the app and navigate to **Test simple navigation**.

- [ ] Expected: Three tabs are visible in the tab bar -
  **First**, **Second**, and **Third**. The **First** tab is
  active. The content area displays the label `First`.

---

### Native tab-bar navigation

2. Tap the **Second** tab in the tab bar.

- [ ] Expected: The **Second** tab becomes active. The content
  area displays the label `Second`.

3. Tap the **Third** tab in the tab bar.

- [ ] Expected: The **Third** tab becomes active. The content
  area displays the label `Third`.

4. Tap the **First** tab in the tab bar.

- [ ] Expected: The **First** tab becomes active. The content
  area displays the label `First`.

---

### Programmatic navigation via selectTab

5. While on the **First** tab, tap **Select Second**.

- [ ] Expected: The **Second** tab becomes active. The content
  area displays the label `Second`.

6. While on the **Second** tab, tap **Select Third**.

- [ ] Expected: The **Third** tab becomes active. The content
  area displays the label `Third`.

7. While on the **Third** tab, tap **Select First**.

- [ ] Expected: The **First** tab becomes active. The content
  area displays the label `First`.

---

### Skipping tabs

8. While on the **First** tab, tap **Select Third**.

- [ ] Expected: The **Third** tab becomes active directly,
  skipping **Second**. The content area displays the label
  `Third`.

9. While on the **Third** tab, tap **First** tab in the tab bar.

- [ ] Expected: The **First** tab becomes active directly,
  skipping **Second**. The content area displays the label
  `First`.

---

### Mixed navigation (tab-bar then programmatic)

10. Tap the **Second** tab in the tab bar.

- [ ] Expected: The **Second** tab is active, label shows
  `Second`.

11. Tap **Select First** in the content area.

- [ ] Expected: The **First** tab becomes active. The content
  area displays the label `First`. The tab-bar item for
  **First** is visually selected.

---

### Re-selecting the active tab (edge case)

12. While on the **First** tab, tap the **First** tab bar item
    again.

- [ ] Expected: The **First** tab remains selected. The content
  area still displays `First`. No crash or unexpected transition
  occurs.

13. While on the **First** tab, tap **Select First**.

- [ ] Expected: The **First** tab remains selected. The content
  area still displays `First`. No crash or unexpected state
  change occurs.

---

### Rapid programmatic switching (edge case)

14. From the **First** tab, tap **Select Second** and immediately
    tap **Select Third** before the transition completes.

- [ ] Expected: The final active tab is **Third**. The content
  area displays the label `Third`. No crash or inconsistent
  label is shown.
