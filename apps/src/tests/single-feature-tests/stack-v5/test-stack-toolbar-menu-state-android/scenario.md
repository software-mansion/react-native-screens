# Test Scenario: Stack Toolbar Menu State (Android)

## Details

**Description:** Verifies that the Android toolbar menu's runtime state on the
v5 stack header — checkbox/radio selections and everything applied via the
`updateToolbarMenuElements` view command — survives every native header
rebuild, and that only a real `toolbarMenu` prop change resets it. Also
verifies that a deep-equal `toolbarMenu` re-send is a no-op, that a rebuild
replays state without re-emitting callbacks, and that commands sent while the
header is hidden are recorded, emit their selection events, and take effect
once the header is shown again.

**OS test creation version:** Android: API Level 37.

## E2E test

TBD: sections A–E are automatable — every check is on menu state, not on
colors or drawables — but the spec has not been written yet.

Section F is not automatable: Detox cannot read a drawable, so it cannot tell
which image an action button shows. Verify it visually.

## Prerequisites

- Android emulator or device.

## Note

- The menu has two groups: `filters` (checkboxes, `filterA` initially
  checked) and `sort` (single-selection radio, `sortAsc` initially selected).
  `action` is a toolbar button with a bundled photo icon; `plain` is an
  ungrouped overflow row whose title carries the menu version.
- **Events** counts every `onPress` and `onSelectionChange`. A rebuild
  replays state onto the new toolbar without emitting anything, so the
  counter must not move in sections B, C and D.
- Every control under **Header rebuilds** rebuilds the native header while
  re-sending a deep-equal `toolbarMenu`. None of them is a menu change.
- **Change toolbarMenu prop** is the only real menu change on this screen.
- `hostColorScheme` is only visible when it differs from the effective scheme
  already in use; if the device is already dark, pick `light` instead.
- `maxLines` affects the **expanded** title of a `medium` / `large` header
  only — it is ignored for `small`, and a collapsed title is always a single
  line. The header title is long on purpose so the wrap is visible; step 5
  therefore runs after step 4 has switched the header to `medium`.
- Android's overflow menu does not render row icons, so an icon is only
  visible on **Action**, which sits in the toolbar. The prop-declared icon is
  the photo; the command `icon` option sets a distinct search glyph.

## Steps

### A. Baseline — initial render

1. Launch the app and navigate to **Stack Toolbar Menu State**. Open the
   overflow menu.

- [ ] The header shows the long title, ellipsized to one line, and the
      toolbar shows the **Action** button with a photo icon.
- [ ] The overflow menu shows: Filter A (checked), Filter B (unchecked), Sort
      ascending (selected), Sort descending (unselected), Plain v1.
- [ ] **Events: 0** — `initialToggleState` does not emit at mount.

---

### B. State survives header rebuilds

2. Check **Filter B**, reopen the overflow menu and select **Sort
   descending**.

- [ ] **Last Event** reads `sort: ["sortDesc"]` and **Events: 2**.

3. Set target id = `plain`, title = `Changed`, all others = `no change`. Tap
   **Send Command**.

- [ ] Open the overflow menu: the last row reads "Changed" instead of
      "Plain v1".

4. Change `headerType` from `small` to `medium`.

- [ ] The header rebuilds — the title moves into the collapsing area.
- [ ] Open the overflow menu: **Filter A** and **Filter B** are checked,
      **Sort descending** is selected, and the last row still reads
      "Changed".
- [ ] **Events: 2** — the rebuild re-emitted nothing.

5. Change `maxLines` from `1` to `2`.

- [ ] The expanded title now wraps onto two lines instead of being
      ellipsized.
- [ ] Same menu state as in step 4, **Events: 2**.

6. Change `hostColorScheme` from `inherit` to `dark`.

- [ ] The header re-themes. Same menu state as in step 4, **Events: 2**.

7. Toggle **header hidden** ON, then OFF again.

- [ ] The header disappears and comes back. Same menu state as in step 4,
      **Events: 2**.

---

### C. A deep-equal `toolbarMenu` re-send is a no-op

8. Tap **Re-send menu (deep-equal)**.

- [ ] Open the overflow menu: nothing changed — **Filter A** and **Filter B**
      checked, **Sort descending** selected, last row "Changed".
- [ ] **Events: 2**.

---

### D. A real `toolbarMenu` change resets the state

9. Tap **Change toolbarMenu prop (v1 → v2)**, then open the overflow menu.

- [ ] The last row reads "Plain v2" — the command-applied title is gone.
- [ ] **Filter A** is checked, **Filter B** is unchecked and **Sort
      ascending** is selected: the selections are back to their
      `initialToggleState`.
- [ ] **Events: 2** — the reset does not emit `onSelectionChange`.

---

### E. Commands sent while the header is hidden

10. Toggle **header hidden** ON.

- [ ] The header disappears and the content moves to the top of the screen.

11. Set target id = `filterB`, checked = `true`, all others = `no change`.
    Tap **Send Command**.

- [ ] **Last Event** reads `filters: ["filterA","filterB"]` and **Events: 3**
      — the event fires while the header is hidden.

12. Set target id = `plain`, title = `Changed`, checked = `no change`. Tap
    **Send Command**.

- [ ] **Events: 3** — a title change emits nothing.

13. Toggle **header hidden** OFF, then open the overflow menu.

- [ ] **Filter A** and **Filter B** are both checked and the last row reads
      "Changed": both commands applied on the next build.

---

### F. Icons across rebuilds — visual

14. Change `headerType` back to `small`.

- [ ] The **Action** button still shows the photo declared in `toolbarMenu`.
      Prop icons survive the rebuild together with the rest of the state.

15. Set target id = `action`, icon = `search`, all others = `no change`. Tap
    **Send Command**.

- [ ] The **Action** button switches to the search glyph — a command icon
      takes precedence over the one declared in `toolbarMenu`.

16. Change `headerType` to `large`, then toggle **header hidden** ON and OFF.

- [ ] The **Action** button still shows the search glyph after both rebuilds.
      Command icons are state and survive like every other override.

17. Tap **Change toolbarMenu prop**.

- [ ] The **Action** button reverts to the photo. The command icon lasted
      exactly until the next real menu change, like the rest of the command
      state.
