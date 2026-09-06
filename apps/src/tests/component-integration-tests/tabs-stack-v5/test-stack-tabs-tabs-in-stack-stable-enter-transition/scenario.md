# Test Scenario: Tabs in Stack - stable enter transition

## Details

**Description:** Verify that pushing a `StackContainer` screen that has a
nested `TabsContainer` plays a stable enter transition (without any visual content jumps).

**OS test creation version:** TBD

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS or Android device / simulator.

## Steps

### Baseline

1. Launch the app and navigate to the **Tabs in Stack - stable enter
   transition** screen.

- [ ] The "First stack screen" is shown on a light blue background
      with a "Go to nested tabs" button.

---

### Enter transition

2. Tap the "Go to nested tabs" button.

- [ ] The stack pushes the second screen ("Nested Tabs") with a
      standard push animation. The nested tabs content ("Home tab" with its
      `tab routeKey`) and the tab bar (Home / Settings) are already correctly
      laid out as the screen slides in. There is **no** flicker, no flash of an
      empty/white screen, no layout jump, and no momentary mis-position of the
      tab bar or tab content during the transition.

---

### Tab switching after transition

3. Once the transition finishes, switch between the "Home" and "Settings" tabs.

- [ ] Both tabs render their content centered ("Home tab" /
      "Settings tab") together with the corresponding `tab routeKey`. Switching
      tab runs a slide-in animation for the active indicator and the label
      of the selected tab.
