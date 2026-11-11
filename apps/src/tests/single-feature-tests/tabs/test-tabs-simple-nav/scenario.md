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

Incomplete: The E2E test covers all steps except step 1 of
**Rapid programmatic switching (edge case)**, which is omitted because Detox
automatically waits for the UI layer to become idle. Due to this synchronization
model, it cannot execute rapid tab switching sequentially before the previous
transition animation finishes.

## Prerequisites

- iOS device or simulator
- Android emulator or device

## Steps

### Baseline

1. Launch the app and navigate to **Test simple navigation**.

    - [ ] Three tabs are visible in the tab bar -
          **First**, **Second**, and **Third**. The **First** tab is
          active. The content area displays the label `First`.

---

### Native tab-bar navigation

1. Tap the **Second** tab in the tab bar.

    - [ ] The **Second** tab becomes active. The content
          area displays the label `Second`.

2. Tap the **Third** tab in the tab bar.

    - [ ] The **Third** tab becomes active. The content
          area displays the label `Third`.

3. Tap the **First** tab in the tab bar.

    - [ ] The **First** tab becomes active. The content
          area displays the label `First`.

---

### Programmatic navigation via selectTab

1. While on the **First** tab, tap **Select Second**.

    - [ ] The **Second** tab becomes active. The content
          area displays the label `Second`.

2. While on the **Second** tab, tap **Select Third**.

    - [ ] The **Third** tab becomes active. The content
          area displays the label `Third`.

3. While on the **Third** tab, tap **Select First**.

    - [ ] The **First** tab becomes active. The content
          area displays the label `First`.

---

### Skipping tabs

1. While on the **First** tab, tap **Select Third**.

    - [ ] The **Third** tab becomes active directly,
          skipping **Second**. The content area displays the label
          `Third`.

2. While on the **Third** tab, tap **First** tab in the tab bar.

    - [ ] The **First** tab becomes active directly,
          skipping **Second**. The content area displays the label
          `First`.

---

### Mixed navigation (tab-bar then programmatic)

1. Tap the **Second** tab in the tab bar.

    - [ ] The **Second** tab is active, label shows
          `Second`.

2. Tap **Select First** in the content area.

    - [ ] The **First** tab becomes active. The content
          area displays the label `First`. The tab-bar item for
          **First** is visually selected.

---

### Re-selecting the active tab (edge case)

1. While on the **First** tab, tap the **First** tab bar item
    again.

    - [ ] The **First** tab remains selected. The content
          area still displays `First`. No crash or unexpected transition
          occurs.

2. While on the **First** tab, tap **Select First**.

    - [ ] The **First** tab remains selected. The content
          area still displays `First`. No crash or unexpected state
          change occurs.

---

### Rapid programmatic switching (edge case)

1. From the **First** tab, tap **Select Second** and immediately
    tap **Select Third** before the transition completes.

    - [ ] The final active tab is **Third**. The content
          area displays the label `Third`. No crash or inconsistent
          label is shown.
