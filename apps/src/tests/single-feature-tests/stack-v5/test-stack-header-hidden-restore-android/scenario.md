# Test Scenario: Stack header hidden restore

## Details

**Description:** Verifies the collapse state of a Stack v5 header after it is
removed and shown again: by toggling `hidden` (also while a `type` change
lands, and on a screen that mounts hidden) or by detaching `headerConfig`.
Pass: the header comes back fully collapsed when the content is scrolled and
expanded when the content is at the top, under every scroll-flag preset.

**OS test creation version:** Android: API Level 37.

## E2E test

TBD: planned, will be implemented separately.

## Prerequisites

- Android emulator or device.

## Note

- A re-shown header comes back fully collapsed when the content is scrolled
  away from the top and expanded when the content is at the top, regardless
  of its state before removal.
- Fully collapsed: only the toolbar row is visible. With the `scroll only`,
  `enterAlways` and `enterAlwaysCollapsed` presets the whole header is
  scrolled off screen instead and only the status bar scrim remains behind
  the status bar.
- **Known issue:** with a `medium` or `large` header and the `scroll only`,
  `enterAlways` or `enterAlwaysCollapsed` preset, the status bar scrim fades
  in when the header is re-shown
  (https://github.com/software-mansion/react-native-screens-labs/issues/1782).

## Steps

### Baseline

1. Launch the app and navigate to the **Stack header hidden restore** screen.

   - [ ] The "Home" screen shows a large header titled "Hidden restore" with
         the controls right below it.

2. Scroll down one full screen, then back to the top.

   - [ ] The header collapses on the way down and is expanded again at the
         top; the controls stay pinned below it and never scroll away.

---

### Re-show with the content at the top

3. Drag up by more than half of the header height but less than its full
   height, then release.

   - [ ] The header snaps to fully collapsed; the text below the controls has
         not moved.

4. Toggle "hidden" on.

   - [ ] There is no header and the controls start below the status bar.

5. Toggle "hidden" off.

   - [ ] The header is back and expanded (see Note).

6. Set "scroll flags" to `no snap`, drag up by less than the header height
   and release so that the header rests part-way, then toggle "hidden" on
   and off.

   - [ ] The header comes back expanded (see Note).

---

### Re-show with the content scrolled

7. Set "scroll flags" to `default`, scroll down one full screen, then toggle
   "hidden" on and off.

   - [ ] The header comes back fully collapsed and the text below the controls
         has not moved.

8. Scroll back to the top, toggle "hidden" on, scroll down one full screen,
   then toggle "hidden" off.

   - [ ] The header comes back fully collapsed.

9. Toggle "hidden" on, scroll back to the top, then toggle "hidden" off.

   - [ ] The header comes back expanded.

---

### Header removed in other ways

10. Scroll down one full screen, toggle "hidden" on, set "type" to `medium`,
    then toggle "hidden" off.

    - [ ] The header comes back as a medium header, fully collapsed.

11. Set "type" back to `large`, then toggle "headerConfig" off and on.

    - [ ] The header comes back as a large header, fully collapsed.

---

### Scroll-flag presets

12. Scroll back to the top, set "scroll flags" to `scroll only`, scroll down
    one full screen, then toggle "hidden" on and off.

    - [ ] The header comes back scrolled entirely off screen (see Known Issue in
          the Note)

13. Set "scroll flags" to `enterAlways`, scroll down one full screen, then
    toggle "hidden" on and off.

    - [ ] The header comes back scrolled entirely off screen.

14. Drag down until the whole header has re-entered and release right away,
    then toggle "hidden" on and off.

    - [ ] The header comes back scrolled entirely off screen (see Note).

15. Set "scroll flags" to `enterAlwaysCollapsed`, scroll down one full screen,
    then toggle "hidden" on and off.

    - [ ] The header comes back scrolled entirely off screen.

16. Drag down until the toolbar row has re-entered and release right away,
    then toggle "hidden" on and off.

    - [ ] The toolbar row is gone again; only the status bar scrim is left.

17. Set "scroll flags" to `none`, scroll down one full screen, then toggle
    "hidden" on and off.

    - [ ] The header comes back at its full height.

18. Set "type" to `small` and "scroll flags" to `scroll only`, scroll down one
    full screen, then toggle "hidden" on and off.

    - [ ] The toolbar comes back scrolled off screen.

---

### Hidden from the start

19. Set "type" to `large` and "scroll flags" to `default`, scroll back to the
    top, then tap "Push Details".

    - [ ] The "Details" screen has no header; its "hidden" switch starts below
          the status bar.

20. Scroll down one full screen, then toggle "hidden" off.

    - [ ] The header appears fully collapsed.

21. Tap the back button.

    - [ ] The "Home" screen is shown with an expanded large header.
