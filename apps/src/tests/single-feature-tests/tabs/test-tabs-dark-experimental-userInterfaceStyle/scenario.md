# Test Scenario: experimental_userInterfaceStyle

**E2E test:** No

## Prerequisites

- iOS device/simulator (use Cmd+Shift+A to toggle appearance on simulator)

## Assumptions

- Both tabs (`Tab1`, `Tab2`) have `experimental_userInterfaceStyle: 'dark'` hardcoded.
- The scenario is reached by pushing **Dark Screen** from the initial stack screen.
- System color scheme changes are reflected by toggling appearance on the simulator or device.

---

## Steps

### Baseline

1. Launch the app and navigate to the Tab Bar Experimental UIStyle: dark. Ensure system appearance is set to **light**.

- [ ] Expected: First screen is shown with a black background. A single button to push the screen with dark style is visible.

---

### Pushing the dark screen — light system mode

2. With system appearance set to **light**, tap **"Push screen with style: dark"**.

- [ ] Expected: `DarkScreen` is pushed. The tab bar appears **dark** despite the system being in light mode — `experimental_userInterfaceStyle: dark` overrides the system setting.

3. Verify the navigation bar (back button area) on the pushed screen.

- [ ] Expected: The navigation bar also reflects a dark style (light-colored back button / title text).

4. Switch between **Tab1** and **Tab2** on the pushed screen.

- [ ] Expected: Both tabs maintain the dark interface style. No flash, flicker, or reversion to light style on tab switch.

---

### Pushing the dark screen — dark system mode

5. Pop back to `Screen1`. Set system appearance to **dark**. Push **"Push screen with style: dark"** again.

- [ ] Expected: Tab bar and navigation bar appear **dark** — consistent with both the prop value and the system setting. No visual difference compared to step 2.

---

### Popping back — system appearance restored

6. With system appearance set to **light**, push `DarkScreen` so the tab bar is dark. Then tap the back button to return to `Screen1`.

- [ ] Expected: After popping, `Screen1` returns to its normal appearance (black background, no tab bar). No leftover dark styling bleeds into `Screen1`.

7. Push `DarkScreen` and pop back several times in quick succession.

- [ ] Expected: No crash, layout freeze, or persistent dark-style bleed onto `Screen1`.

---

### Status bar

8. While on `DarkScreen` (system set to **light**), observe the status bar.

- [ ] Expected: Status bar displays with **light content** (white text/icons), consistent with `statusBarStyle: "light"` set on the stack screen options.

9. Pop back to `Screen1` and observe the status bar.

- [ ] Expected: Status bar returns to its default appearance for `Screen1` — no leftover light status bar style.