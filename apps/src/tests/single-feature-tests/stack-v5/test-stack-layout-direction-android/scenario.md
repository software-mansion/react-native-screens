# Test Scenario: Stack Layout Direction

## Details

**Description:** Verify the `direction` prop of `StackHost`: `ltr` and `rtl`
lay the header and the screen content out in that direction, `inherit` follows
React Native, and a change at runtime re-lays the header out immediately. Pass:
the title, the subviews, the back button and the toolbar menu each sit on their
direction-relative edge, the collapsed title covers none of them, and push and
pop transitions mirror. Header content insets under RTL are covered by
`test-stack-header-content-insets-android`.

**OS test creation version:** Android: API Level 37.

## E2E test

TBD: the probe and title bounds are readable with Detox, the back arrow
mirroring and the transition direction are not; not implemented yet.

## Prerequisites

- Android emulator or device.
- Steps 14-17 need **API 33 or newer**: they rely on the `default` animation,
  which below API 33 is a zoom with no sideways motion.

## Note

- **Probe reference:** `L·48` is the leading subview, `T·48` the trailing one
  and `C·48` the center one. `L` and `T` swap sides with the direction, `C`
  stays centered.
- Wait for every transition to finish before the next tap.
- **Known issue:** turning "titleCentered" on does not move a leading subview
  to the leading edge; it keeps the offset from that edge it had while the
  title was not centered
  (https://github.com/software-mansion/react-native-screens-labs/issues/1835).

## Steps

### Baseline

1. Launch the app and navigate to the **Stack Layout Direction** screen.

   - [ ] The header shows the title "Direction" and the subtitle "Subtitle"
         left-aligned, `L·48` next to them and `T·48` on the right edge.
   - [ ] "direction" reads `inherit`, "type" reads `small`, "menu" reads `none`
         and the screen shows `I18nManager.isRTL == false`.
   - [ ] The content row reads "START" on the left and "END" on the right.

---

### Small header

2. Set "direction" to `rtl`.

   - [ ] The title and subtitle are right-aligned, `L·48` next to them and
         `T·48` on the left edge.
   - [ ] The content row reads "END" on the left and "START" on the right.

3. Turn "titleCentered" and "subtitleCentered" on.

   - [ ] The title and subtitle are horizontally centered.
   - [ ] `L·48` does not move: it keeps the same gap from the right edge that
         it had while the title was right-aligned (see Note).

4. Turn "titleCentered" and "subtitleCentered" off, then set "menu" to
   `action + overflow`.

   - [ ] The title and subtitle are right-aligned again.
   - [ ] From the left edge the order is `⋮`, "Act", `T·48`, and `L·48` stays
         next to the title on the right.

5. Turn "centerSubview" on.

   - [ ] `C·48` is centered in the bar, between `T·48` on the left and `L·48`
         on the right.

6. Set "direction" to `ltr`.

   - [ ] The title and subtitle are left-aligned, `L·48` is next to them on
         the left and `C·48` is still centered.
   - [ ] From the right edge the order is `⋮`, "Act", `T·48`.
   - [ ] The content row reads "START" on the left again.

---

### Collapsing header

7. Turn "centerSubview" off, set "type" to `large`, then set "direction" to
   `rtl`.

   - [ ] `L·48` is on the right edge and `T·48`, "Act" and `⋮` are on the left,
         each at its full width and none of them clipped.
   - [ ] The expanded title is large and on the right.

8. Set "expandedTitleHorizontalGravity" to `end`.

   - [ ] The expanded title moves to the left.

9. Set "expandedTitleHorizontalGravity" back to `start`, then scroll down one
   full screen.

   - [ ] Only the toolbar row is left, with `L·48` still on the right and
         `T·48`, "Act" and `⋮` still on the left.
   - [ ] The collapsed title sits next to `L·48` on the right, covering neither
         `T·48` nor the menu items.

10. Set "collapsedTitleHorizontalGravity" to `center`.

    - [ ] The collapsed title is centered between `L·48` and `T·48`, covering
          neither.

11. Set "collapsedTitleHorizontalGravity" to `end`.

    - [ ] The collapsed title sits next to `T·48` on the left, covering neither
          it nor the menu items.

12. Set "collapsedTitleHorizontalGravity" back to `start`, then set "direction"
    to `ltr`.

    - [ ] The collapsed row mirrors: `L·48` on the left edge, `T·48`, "Act" and
          `⋮` on the right, and the collapsed title next to `L·48` on the left.

13. Scroll back to the top.

    - [ ] The header is fully expanded, its title is large and on the left, and
          `L·48` keeps its full width on the left edge.

---

### Navigation

14. Tap "Reset", set "direction" to `rtl`, then tap "Push screen (adds a back
    button)".

    - [ ] The incoming screen slides in a short distance from the left while
          fading in, and the covered screen moves slightly to the right.
    - [ ] Its back arrow is on the right edge and points right.
    - [ ] Its header is right-to-left from the first frame; it does not appear
          left-to-right and then flip.

15. Tap the back arrow.

    - [ ] The popped screen moves a short distance to the left while fading
          out, mirroring the push.

16. Tap "Push screen (adds a back button)", then set "direction" to `ltr`.

    - [ ] The pushed screen's header and content flip: `L·48` moves to the
          left next to the title, `T·48` to the right edge, and the back arrow
          moves to the left edge and points left.

17. Tap the back arrow.

    - [ ] The popped screen moves a short distance to the right while fading
          out.

---

### Direction inherited from React Native

18. Turn "forceRTL" on, restart the app, then navigate to the **Stack Layout
    Direction** screen.

    - [ ] The screen shows `I18nManager.isRTL == true`, "direction" reads
          `inherit`, and the header and content are laid out right-to-left.

19. Set "direction" to `ltr`.

    - [ ] The header and content are laid out left-to-right.

20. Turn "forceRTL" off, restart the app, then navigate to the **Stack Layout
    Direction** screen.

    - [ ] The screen matches step 1: `I18nManager.isRTL == false`, the title
          and subtitle left-aligned, `L·48` next to them and `T·48` on the
          right edge.
