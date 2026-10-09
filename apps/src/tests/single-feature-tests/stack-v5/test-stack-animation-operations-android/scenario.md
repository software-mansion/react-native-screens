# Test Scenario: Stack Animation Operations (Android)

## Details

**Description:** Verify which screen's `animation` plays for each shape of a
stack operation on Android: a single push and pop, a multi-push, a multi-pop, a
replace and a multi-replace, and what a new operation does to a transition that
is still running. Every route carries a different preset, so exactly one
direction is correct for each operation. Pass: only the screen that ends on top
(push) or that was on top (pop, replace) moves, and no other screen in the
batch is ever visible.

**OS test creation version:** Android API Level 37.

## E2E test

Incomplete: no step is automated. For manual testing perform steps 1-21.

Which screen moves, in which direction, and whether an intermediate screen
flashes are not assertable with Detox; only the resulting stack would be.

## Prerequisites

- Android emulator or device.
- System animations are on: "Settings → Accessibility → Color and motion →
  Remove animations" is off.
- Developer options, for steps 17-21 only: set "Animator duration scale" and
  "Transition animation scale" to 5x before step 17 and back to 1x after
  step 21.

## Note

- Wait for every transition to finish before the next tap, except where a step
  says to tap during one.
- Static: the screen does not move and stays fully visible for the whole
  transition.
- **Known issue:** an operation dispatched while a transition is still running
  completes that transition instantly; a screen the new batch pops is removed
  without its pop animation, and only a newly appearing screen animates, over
  the window background.

## Steps

### Baseline

1. Launch the app and navigate to the **Stack Animation Operations (Android)**
   screen.

   - [ ] The screen is yellow with the title "Home · default", and "Pop",
         "Pop 2", "Pop 3", "Replace with Right", "Replace with Bottom" and
         "Replace 2 with Left + Top" are disabled.

---

### Single push and pop

2. Tap "Push Right".

   - [ ] "Right" (blue) slides in from the right and "Home" slides out to the
         left.

3. On "Right", tap "Pop".

   - [ ] "Right" slides out to the right and "Home" slides in from the left.

---

### Multi-push

4. Tap "Push Left + Top".

   - [ ] "Top" (purple) drops in from the top edge above a static "Home"; no
         red screen and no leftward slide appears at any point.
   - [ ] "Pop 2" is enabled.

5. On "Top", tap "Pop".

   - [ ] "Top" rises out through the top edge above a static "Left" (red).

6. On "Left", tap "Pop".

   - [ ] "Left" slides out to the left and "Home" slides in from the right.

7. Tap "Push Right + Bottom + Left".

   - [ ] "Left" slides in from the left and "Home" slides out to the right; no
         blue and no green screen appears at any point.
   - [ ] "Pop 3" is enabled.

---

### Multi-pop

8. On "Left", tap "Pop 2".

   - [ ] "Left" slides out to the left and "Right" (blue) slides in from the
         right; "Bottom" (green) never appears.

9. On "Right", tap "Push Top".

   - [ ] "Top" drops in from the top edge above a static "Right".

10. On "Top", tap "Pop 2".

    - [ ] "Top" rises out through the top edge above a static "Home"; "Right"
          never appears.
    - [ ] "Pop" is disabled on "Home".

---

### Replace

11. Tap "Push Right", then tap "Replace with Bottom" on it.

    - [ ] "Right" slides out to the right and "Bottom" (green) slides in from
          the left; "Bottom" does not rise from the bottom edge and "Home"
          does not appear.
    - [ ] "Pop" is enabled and "Pop 2" is disabled.

12. On "Bottom", tap "Pop".

    - [ ] "Bottom" sinks to the bottom edge above a static "Home".

13. Tap "Push Left", then tap "Replace with Right" on it.

    - [ ] "Left" slides out to the left and "Right" slides in from the right.

---

### Multi-replace

14. On "Right", tap "Push Bottom", then tap "Replace 2 with Left + Top" on
    "Bottom".

    - [ ] "Bottom" sinks to the bottom edge above "Top" (purple), which is
          already in place; no blue screen and no leftward slide appears, and
          "Top" does not drop in from the top edge.
    - [ ] "Pop 2" is enabled.

15. On "Top", tap "Pop".

    - [ ] "Top" rises out through the top edge above a static "Left".

16. On "Left", tap "Pop".

    - [ ] "Left" slides out to the left and "Home" slides in from the right.

---

### Interrupted operations (with extended animation duration scale)

17. Tap "Push Right", then tap "Push Bottom" on "Right" while it is still
    sliding in.

    - [ ] The running transition jumps to its end, then "Bottom" rises from the
          bottom edge above a static "Right"; no stale copy of another screen
          is left behind.

18. On "Bottom", tap "Pop", then tap "Pop" on "Right" while "Bottom" is still
    sinking.

    - [ ] "Right" is removed without its pop animation and "Home" slides in
          from the left over the window background (see Note); "Home" is the
          only screen left, without a crash.

19. Tap "Push Right + Bottom + Left", then tap "Pop 3" on "Left" while it is
    still sliding in.

    - [ ] "Left" is removed without its pop animation and "Home" is shown at
          once, with nothing sliding in (see Note).
    - [ ] "Pop" is disabled on "Home".

20. Tap "Push Right", then tap "Replace with Bottom" on "Right" while it is
    still sliding in.

    - [ ] "Right" is removed at once and "Bottom" slides in from the left over
          the window background (see Note); "Home" does not appear.

21. On "Bottom", tap "Pop".

    - [ ] "Bottom" sinks to the bottom edge above a static "Home", and "Pop"
          is disabled on "Home".
