# Test Scenario: Stack Toolbar Menu Groups (Android)

## Details

**Description:** This test focuses on toolbar menu groups on the
gamma stack header for Android. It verifies multi-toggle (checkbox)
and single-selection (radio) group behavior, `onSelectionChange`
callbacks with correct IDs, `onPress` on ungrouped action items,
groups scoped to nested submenus, `initialToggleState`,
`toolbarMenuGroupDividerEnabled`, runtime props updates (group
type change, adding/removing items, full rebuild resetting command
state), and imperative `setToolbarMenuItemOptions` commands
(`checked`, `title`, `hidden`) — including auto-uncheck in
single-selection groups, no-op on `checked=false` for radio,
and hidden items preserving their selection in callbacks.

**OS test creation version:** Android: API Level 36

## E2E test

TBD — automation is possible and planned but not yet implemented.

## Prerequisites

- Android emulator or device

## Note

- The initial menu structure is:
  - Colors group (multi-toggle, `groupId: 'colors'`):
    - `red`: "Red" (checked via `initialToggleState`)
    - `green`: "Green"
    - `blue`: "Blue"
  - Size group (single-selection, `groupId: 'size'`):
    - `small`: "Small"
    - `medium`: "Medium" (checked via `initialToggleState`)
    - `large`: "Large"
  - `share`: "Share" (ungrouped action item)
  - `sub`: "More" (submenu containing):
    - Theme group (single-selection, `groupId: 'theme'`):
      - `light`: "Light" (checked via `initialToggleState`)
      - `dark`: "Dark"
    - `info`: "Info" (ungrouped action item)
- Groups are scoped to the menu level they are defined in —
  groups cannot span submenus.
- `setToolbarMenuItemOptions` targets elements by `id`. It works
  on items at any nesting depth.

## Steps

### Baseline — initial render and toggle states

1. Launch the app and navigate to **Stack Toolbar Menu Groups**.
   Open the overflow menu.

- [ ] Header title reads "Toolbar Menu Groups Test". The overflow
      menu shows: Red (checked), Green, Blue, Small, Medium
      (checked), Large, Share, More (with submenu indicator).

2. Tap "More" in the overflow menu.

- [ ] A submenu opens showing: Light (checked), Dark, Info.

---

### Multi-toggle group (colors)

3. Open the overflow menu and tap "Green".

- [ ] A toast `colors: ["red", "green"]` is displayed.
- [ ] When the menu is reopened, both Red and Green are checked.

4. Open the overflow menu and tap "Red".

- [ ] A toast `colors: ["green"]` is displayed.
- [ ] When the menu is reopened, Red is unchecked. Green is
      still checked.

5. Open the overflow menu and tap "Green".

- [ ] A toast `colors: []` is displayed.
- [ ] When the menu is reopened, no items in the colors group
      are checked.

6. Open the overflow menu and tap "Blue".

- [ ] A toast `colors: ["blue"]` is displayed.
- [ ] When the menu is reopened, Blue is checked.

---

### Single-selection group (size)

7. Open the overflow menu and tap "Small".

- [ ] A toast `size: ["small"]` is displayed.
- [ ] When the menu is reopened, Small is checked. Medium is
      unchecked.

8. Open the overflow menu and tap "Large".

- [ ] A toast `size: ["large"]` is displayed.
- [ ] When the menu is reopened, Large is checked. Small is
      unchecked.

9. Open the overflow menu and tap "Large" again.

- [ ] No toast is displayed (already selected, single-selection
      keeps it). Large remains checked.

---

### Ungrouped action item

10. Open the overflow menu and tap "Share".

- [ ] A toast `Pressed: share` is displayed.
- [ ] Share has no checkmark. The menu closes.

---

### Submenu group (theme — single-selection)

11. Open the overflow menu, tap "More", then tap "Dark".

- [ ] A toast `theme: ["dark"]` is displayed.
- [ ] When More is reopened, Dark is checked. Light is unchecked.

12. Open the overflow menu, tap "More", then tap "Light".

- [ ] A toast `theme: ["light"]` is displayed.
- [ ] When More is reopened, Light is checked. Dark is unchecked.

13. Open the overflow menu, tap "More", then tap "Info".

- [ ] A toast `Pressed: info` is displayed.
- [ ] Info has no checkmark. No toggle behavior.

---

### Divider enabled

14. Toggle "divider enabled" ON in the controls.

- [ ] Reopen the overflow menu: visual dividers appear between
      groups (between colors and size group, between size group
      and Share, etc.).

15. Toggle "divider enabled" OFF.

- [ ] Dividers disappear from the overflow menu.

---

### Props update — change group type

16. Toggle "singleSelection on colors" ON.

- [ ] Props rebuild occurs. Open the overflow menu: the colors
      group now behaves as single-selection. Only Red is checked
      (from `initialToggleState`).

17. Open the overflow menu and tap "Green".

- [ ] A toast `colors: ["green"]` is displayed.
- [ ] When the menu is reopened, Green is checked. Red is
      unchecked (radio behavior).

18. Toggle "singleSelection on colors" OFF.

- [ ] Props rebuild occurs. The colors group reverts to
      multi-toggle. Open the menu: only Red is checked
      (initial state restored).

---

### Props update — add/remove items

19. Toggle "include Blue" OFF.

- [ ] Open the overflow menu: Blue is gone. Red (checked) and
      Green are visible in the colors group.

20. Toggle "include Blue" ON.

- [ ] Blue reappears in the overflow menu (unchecked, since
      `initialToggleState` is false/absent).

---

### Command: checked on multi-toggle group

21. In **Send Command**, set target id = `green`,
    checked = `true`. Tap **Send Command**.

- [ ] Open the overflow menu: Green is now checked alongside
      Red.

22. Set target id = `green`, checked = `false`.
    Tap **Send Command**.

- [ ] Open the overflow menu: Green is unchecked. Red is still
      checked.

---

### Command: checked in single-selection group (auto-uncheck)

23. Set target id = `large`, checked = `true`.
    Tap **Send Command**.

- [ ] A toast `size: ["large"]` is displayed.
- [ ] Open the overflow menu: Large is checked. Medium is
      unchecked.

24. Set target id = `small`, checked = `true`.
    Tap **Send Command**.

- [ ] A toast `size: ["small"]` is displayed.
- [ ] Open the overflow menu: Small is checked. Large is
      unchecked.

---

### Command: checked=false on radio is a no-op

25. Ensure Medium is selected in the size group (if not, set
    target id = `medium`, checked = `true`, send). Then set
    target id = `medium`, checked = `false`.
    Tap **Send Command**.

- [ ] Open the overflow menu: Medium is still checked. Setting
      `checked=false` on a single-selection item that is
      currently selected is a no-op — the group always keeps
      one selection.

---

### Command: title and hidden on grouped items

26. Set target id = `red`, title = `Changed`, other fields
    = `no change`. Tap **Send Command**.

- [ ] Open the overflow menu: the item reads "Changed" instead
      of "Red". It is still checked.

27. Set target id = `green`, hidden = `true`, other fields
    = `no change`. Tap **Send Command**.

- [ ] Open the overflow menu: Green is not visible.

28. Set target id = `green`, hidden = `false`.
    Tap **Send Command**.

- [ ] Open the overflow menu: Green reappears.

---

### Command: hidden preserves selection in callbacks

29. Set target id = `green`, checked = `true`. Send. Then set
    target id = `green`, hidden = `true`. Send.

- [ ] Open the overflow menu: Green is not visible.

30. Open the overflow menu and tap "Blue".

- [ ] A toast `colors: ["red", "green", "blue"]` is displayed.
      Green is still reported as selected despite being hidden.

31. Set target id = `green`, hidden = `false`.
    Tap **Send Command**.

- [ ] Open the overflow menu: Green reappears and is still
      checked.

---

### Props rebuild resets command state

32. Toggle "include Blue" OFF then back ON (props rebuild).

- [ ] All command state is lost. Open the overflow menu: Red
      reads "Red" again (not "Changed"). Green is visible and
      unchecked. Medium is checked in the size group (initial
      state restored).

---

### Command: checked in submenu group

33. Set target id = `dark`, checked = `true`.
    Tap **Send Command**.

- [ ] A toast `theme: ["dark"]` is displayed.
- [ ] Open More: Dark is checked. Light is unchecked.

34. Set target id = `light`, checked = `true`.
    Tap **Send Command**.

- [ ] A toast `theme: ["light"]` is displayed.
- [ ] Open More: Light is checked. Dark is unchecked.
