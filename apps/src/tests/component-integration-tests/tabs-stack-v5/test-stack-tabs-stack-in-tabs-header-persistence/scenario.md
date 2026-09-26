# Test Scenario: Stack in Tabs - header persistence across tab switches

## Details

**Description:** Verifies that a Stack v5 header nested in a native tab survives
switching away to another tab and back: the app bar, its title, subtitle,
collapse state and toolbar menu selections come back unchanged and without a
visible flash. Header configuration changed while the tab is away - the title,
`type` and `hidden` - is applied when the tab comes back. Pass: nothing about
the header resets on a tab switch.

**OS test creation version:** Android: API Level 37.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- Android emulator or device.

## Note

- A header that has been hidden and re-shown always comes back expanded.
- Dismiss the overflow menu (tap outside it) after checking it.

## Steps

### Baseline

1. Launch the app and navigate to the **Stack in Tabs - header persistence
   across tab switches** screen.

   - [ ] The "Stack" tab is selected and shows a collapsing header titled
         "Home v1" with the subtitle "Tab persistence" and an overflow menu
         button.

2. Scroll down one full screen, then back to the top.

   - [ ] The header collapses to the toolbar row on the way down and is
         expanded again at the top.

---

### Header survives a tab round trip

3. Switch to the "Other" tab, then back to "Stack".

   - [ ] The header is still there: "Home v1", "Tab persistence" and the
         overflow menu button.
   - [ ] There is no flash of a re-built header when "Stack" comes back.

4. Scroll down one full screen, then back to the top.

   - [ ] The header still collapses on the way down and expands again at the
         top.

5. Switch to the "Other" tab and back to "Stack" 3 times.

   - [ ] The header is present and unchanged after every one of the 3
         switches.

---

### Collapse state survives a tab round trip

6. Scroll until the header is fully collapsed.

   - [ ] Only the toolbar row is left; the expanded title area is gone.

7. Switch to the "Other" tab, then back to "Stack".

   - [ ] The header is still fully collapsed. It does not come back expanded.

---

### Menu selection survives a tab round trip

8. Open the overflow menu.

   - [ ] "Filter A" is checked and "Filter B" is unchecked.

9. Tap "Filter B".

   - [ ] "Last menu selection" reads `["filterA","filterB"]`.

10. Switch to the "Other" tab, back to "Stack", then open the overflow menu.

    - [ ] "Filter A" and "Filter B" are both checked.
    - [ ] "Last menu selection" still reads `["filterA","filterB"]`.

---

### Configuration changed while the tab is away

11. Scroll until the header is fully collapsed. Switch to the "Other" tab,
    tap "Change Home title (v1 → v2)", then switch back to "Stack".

    - [ ] The header title reads "Home v2".
    - [ ] The header is still fully collapsed.

12. Switch to the "Other" tab, set "type" to `large`, then switch back to
    "Stack".

    - [ ] The header is still fully collapsed.

13. Scroll back to the top.

    - [ ] The header expands to a large header, taller than in step 4.

14. Switch to the "Other" tab, toggle "hidden" on, then switch back to
    "Stack".

    - [ ] The "Home" screen has no header and its content starts below the
          status bar.

15. Switch to the "Other" tab, toggle "hidden" off, then switch back to
    "Stack".

    - [ ] The header is back and expanded (see Note).

16. Scroll down one full screen, then back to the top.

    - [ ] The header collapses on the way down and expands again at the top.

17. Switch to the "Other" tab, set "type" to `medium`, then switch back to
    "Stack".

    - [ ] The header is a medium header again, shorter than in step 13.

---

### Pushed screen

18. Tap "Push Details", then switch to the "Other" tab and back to "Stack".

    - [ ] The "Details" header is still present with the title "Details" and
          a back button.

19. Tap the back button.

    - [ ] The "Details" screen is popped.
    - [ ] "Home" screen is shown again, with the title "Home v2".
