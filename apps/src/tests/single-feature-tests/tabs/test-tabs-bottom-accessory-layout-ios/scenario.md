# Test Scenario: bottomAccessory

## Details

**Description:** Tests the bottomAccessory prop on TabsHost, which renders a
component above the tab bar (regular) or inside it (inline). Using five content
variants and scrollable tabs, the test confirms correct rendering, immediate
updates on change, layout stability during tab switches, and proper interaction
with tabBarMinimizeBehavior.

**OS test creation version:** iOS 26.4

## E2E test

Yes: covers most of manual scenario steps only for iPhone; iPad testing would
require app window resizing not supported by Detox.
Not covered:
- Text alignment verification in the bottom accessory.
- Content verification for the last two variants.
- Variant selection visual check (the blue border is not automated).
- Extending the tab bar using the collapsed tab bar state.

## Prerequisites

- iOS 26+ device or simulator: iPhone and iPad

## Note

- `bottomAccessory` is only available on iOS 26 or higher.
- Each of the below steps must be executed twice: once on iPhone and once on iPad.
- On iPad: Resize the window to the compact width size class as the `inline effect`
effect is not applied to the full-size app.
- The **Config** tab is used to select the active accessory variant.
- "Scrolling down" means dragging the list upward (revealing rows below);
  "scrolling up" means dragging the list downward (revealing rows above).

## Steps

### Baseline

1. Launch the app and navigate to the **Bottom Accessory** screen.

- [ ] Expected: Three tabs are visible - **Config**, **ScrollDown**,
  **ScrollUp**. The **Config** tab is selected. Five variant cards are
  displayed in a scrollable list; the first card (**Upper Left**) has a blue
  border indicating it is selected.

2. Observe the area below the tab content and above the tab bar.

- [ ] Expected: A bottom accessory is rendered showing the **Upper Left**
  variant - a green-highlighted label aligned to the top-left corner of the
  accessory area.

---

### Content variants

3. Confirm the first card (**Upper Left**) is selected (blue border).

- [ ] Expected: The accessory displays the green `Upper Left` label aligned
  to the top-left of the accessory slot.

4. Tap the **Center** card on the **Config** tab.

- [ ] Expected: The card border changes to blue. The accessory updates
  immediately to show the green `Center` label aligned to the center of the
  accessory slot.

5. Tap the **Lower Right** card on the **Config** tab.

- [ ] Expected: The card border changes to blue. The accessory updates
  immediately to show the green `Lower Right` label aligned to the
  bottom-right of the accessory slot.

6. Tap the **Long** card with 'Lorem ipsum(...)' text on the **Config** tab.

- [ ] Expected: The card border changes to blue. The accessory updates to
  a view that stretches to fill the available accessory area and displays
  long body text. The tab bar and content area are not obscured beyond the
  designated accessory slot.

7. Tap the **RGB** card with three strips on the **Config** tab.

- [ ] Expected: The card border changes to blue. The accessory updates to
  show three equal vertical strips: red, green,
  and blue, filling the full width of the accessory slot.

---

### Accessory persistence across tab switches

8. With the **Center** variant selected, tap the **ScrollDown** tab.

- [ ] Expected: The **ScrollDown** tab content (a 40-row list) is displayed.
  The Center accessory remains visible below the content and above tab bar.

9.  Tap the **Config** tab.

- [ ] Expected: The **Config** tab is displayed. The Center accessory is still
  visible. The **Center** card still has a blue border.

---

### Accessory during tab bar minimize - onScrollDown

10. Tap the **ScrollDown** tab.

- [ ] Expected: The tab bar is fully visible. The Center accessory is visible in
its `regular` position above the tab bar.

11.  Scroll the list **down** on the **ScrollDown** tab.

- [ ] Expected: The tab bar minimizes as content scrolls down. The accessory
  transitions to the `inline` environment layout (rendered inside the
  collapsed tab bar area).

12. Scroll the list back **up** on the **ScrollDown** tab.

- [ ] Expected: The tab bar expands again. The accessory transitions back to
  the `regular` environment layout above the tab bar.

---

### Accessory during tab bar minimize - onScrollUp

13. Tap the **ScrollUp** tab.

- [ ] Expected: The tab bar is fully visible. The accessory is visible in
  its `regular` position.

14. Scroll the list **up** (toward the top) on the **ScrollUp** tab.

- [ ] Expected: The tab bar minimizes. The accessory transitions to the
  `inline` layout inside the collapsed tab bar.

15. Scroll the list back **down** on the **ScrollUp** tab.

- [ ] Expected: The tab bar expands. The accessory returns to the `regular`
  layout above the tab bar.

---

### Switch with minimized tab bar

16.  Scroll the **ScrollUp** tab so the tab bar minimizes.

- [ ] Expected: The tab bar collapses. The bottom accessory transitions to
the `inline` layout inside the collapsed bar.  

17. Tap on the collapsed tab bar to expand it.

- [ ] Expected: The tab bar expands back to its full height. The bottom
accessory transitions back to the `regular` layout above the tab bar.

18. Tap the **Config** tab from the now-expanded tab bar.

- [ ] Expected: The **Config** tab is shown. The currently selected variant card
still has a blue border.

19. Tap a different variant card (e.g., **RGB**).

- [ ] Expected: The accessory updates immediately to the new variant.

---

### iPad only - full-size app

20.  Resize app to full-size and perform steps 1-7.

- [ ] Expected: Tab bar is displayed at the top of screen. Different bottom
accessory content variants should be displayed correctly at the bottom of the screen.
