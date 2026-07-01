# Test Scenario: Stack Toolbar Nested Menu

## Details

**Description:** This test focuses on the Android toolbar menu submenu
support on the gamma stack header. It verifies that submenus render
correctly as expandable groups in the overflow menu, that `onPress`
fires with the correct id for items at every nesting level (including
deeply nested submenus), that imperative `setToolbarMenuItemOptions`
commands work on both leaf items inside submenus and on submenu
containers themselves (including `menuTitle` changes), and that any
props update rebuilds the entire menu tree — discarding all prior
command-applied state at every level. 

**OS test creation version:** Android: API Level 36

## E2E test

TBD — automation is possible and planned but not yet implemented.

## Prerequisites

- Android emulator or device

## Note

- Submenus appear as items with a submenu indicator (caret/arrow
  icon). Tapping a submenu opens a nested menu instead of firing
  `onPress`.
- `setToolbarMenuItemOptions` targets elements by `id`. It works
  on both leaf items and submenu containers at any nesting depth.
- `menuTitle` controls the header text shown above submenu items
  when the submenu is opened. Only `submenu-1` has `menuTitle`
  set by default ("Header A"). `submenu-2` and `deep-menu` have
  no `menuTitle`, so their submenu headers fall back to `title`.
  When both `menuTitle` and `title` are undefined, no submenu
  header is shown.

## Steps

### Baseline — initial render and submenu structure

1. Launch the app and navigate to **Stack Toolbar Nested Menu**.

- [ ] Header title reads "Toolbar Nested Menu Test". The toolbar
      overflow menu shows three entries: "Top Item", "Submenu A"
      (with a submenu indicator), "Submenu B" (with a submenu
      indicator).

2. Tap "Submenu A" in the overflow menu.

- [ ] A nested menu opens with a submenu header reading
      "Header A". It shows two items: "Sub A.1" and "Sub A.2".

3. Go back to the top-level menu. Tap "Submenu B".

- [ ] A nested menu opens with a submenu header reading
      "Submenu B" (fallback from title — no menuTitle set). It
      shows two entries: "Sub B.1" and "Deep" (with a submenu
      indicator).

4. Tap "Deep" in the Submenu B menu.

- [ ] A nested menu opens with a submenu header reading "Deep"
      (fallback from title — no menuTitle set). It shows one
      item: "Deep.1".

---

### Click handling — items at all nesting levels

5. Open the overflow menu and tap "Top Item".

- [ ] "Last clicked" updates to `item-top`.

6. Open the overflow menu, tap "Submenu A", then tap "Sub A.1".

- [ ] "Last clicked" updates to `sub-1-1`.

7. Open the overflow menu, tap "Submenu A", then tap "Sub A.2".

- [ ] "Last clicked" updates to `sub-1-2`.

8. Open the overflow menu, tap "Submenu B", then tap "Sub B.1".

- [ ] "Last clicked" updates to `sub-2-1`.

9. Open the overflow menu, tap "Submenu B", tap "Deep", then tap
   "Deep.1".

- [ ] "Last clicked" updates to `deep-1`.

---

### Imperative command — change a leaf item inside a submenu

10. In **Send Command**, set target id = `sub-1-1`,
    title = `Title X`, hidden = `no change`. Tap **Send Command**.

- [ ] Open "Submenu A": item 1 now reads "Title X". Item 2 still
      reads "Sub A.2".

11. Tap "Title X" in the submenu.

- [ ] "Last clicked" updates to `sub-1-1` (id is stable across
      title changes).

---

### Imperative command — hide and show a leaf item inside a submenu

12. Set target id = `sub-1-2`, title = `no change`,
    hidden = `true`. Tap **Send Command**.

- [ ] Open "Submenu A": only "Title X" is visible. "Sub A.2" is
      hidden.

13. Set target id = `sub-1-2`, title = `no change`,
    hidden = `false`. Tap **Send Command**.

- [ ] Open "Submenu A": "Sub A.2" reappears alongside "Title X".

---

### Imperative command — change a submenu container

14. Set target id = `submenu-1`, title = `Title X`,
    hidden = `no change`. Tap **Send Command**.

- [ ] In the overflow menu, the submenu previously labeled
      "Submenu A" now reads "Title X". Its children are unchanged
      ("Title X" from step 10 and "Sub A.2").

15. Set target id = `submenu-1`, title = `no change`,
    hidden = `true`. Tap **Send Command**.

- [ ] The submenu disappears from the overflow menu. Only
      "Top Item" and "Submenu B" remain.

16. Set target id = `submenu-1`, title = `no change`,
    hidden = `false`. Tap **Send Command**.

- [ ] The submenu reappears with the title "Title X" (preserved
      from step 14).

---

### Imperative command — change menuTitle

17. Set target id = `submenu-1`, menuTitle = `Header X`,
    title = `no change`, hidden = `no change`.
    Tap **Send Command**.

- [ ] Open the submenu (still labeled "Title X" from step 14):
      the submenu header now reads "Header X".

18. Set target id = `submenu-1`, menuTitle = `undefined`,
    title = `no change`, hidden = `no change`.
    Tap **Send Command**.

- [ ] Open the submenu: the submenu header falls back to the
      title value and reads "Title X".

19. Set target id = `submenu-1`, title = `undefined`,
    menuTitle = `undefined`, hidden = `no change`.
    Tap **Send Command**.

- [ ] Open the submenu: no submenu header is shown at all (both
      menuTitle and title are undefined). The submenu entry in
      the overflow menu also has no title.

---

### Props update drops all command state

20. In **Menu Structure — Props**, toggle the "add extra item to
    submenu-1" switch ON.

- [ ] Open "Submenu A" (which reverts to its prop-configured
      title "Submenu A" because the props update rebuilt the
      menu). The submenu header reads "Header A" (restored from
      props). It now shows three items: "Sub A.1" (reverted from
      "Title X"), "Sub A.2", and "Sub A.3". All command state is
      gone.

---

### Props update — structural changes

21. Toggle the "add extra item to submenu-1" switch OFF.

- [ ] Open "Submenu A": "Sub A.3" disappears. Two items remain:
      "Sub A.1" and "Sub A.2".

22. Change the "submenu-1 title" picker to `Changed`.

- [ ] The submenu now reads "Changed" in the overflow menu. Its
      children are unchanged.

23. Change the "submenu-1 title" picker back to `Submenu A`.

- [ ] The submenu reads "Submenu A" again.

24. Change the "submenu-1 menuTitle" picker to `Changed Header`.

- [ ] Open "Submenu A": the submenu header reads
      "Changed Header". Children unchanged.

25. Change the "submenu-1 menuTitle" picker back to `Header A`.

- [ ] Open "Submenu A": the submenu header reads "Header A"
      again.

26. Change the "submenu-1 menuTitle" picker to `undefined`.

- [ ] Open "Submenu A": the submenu header falls back to the
      title and reads "Submenu A".

27. Change the "submenu-1 title" picker to `undefined`
    (menuTitle is still undefined from the previous step).

- [ ] Open the submenu: no submenu header is shown. The submenu
      entry in the overflow menu also has no title.

28. Change the "submenu-1 title" picker back to `Submenu A`,
    then change "submenu-1 menuTitle" back to `Header A`.

- [ ] The submenu reads "Submenu A" in the overflow menu and the
      submenu header reads "Header A" when opened.

29. Toggle the "include submenu-1" switch OFF.

- [ ] "Submenu A" disappears from the overflow menu. Only
      "Top Item" and "Submenu B" remain.

30. Toggle the "include submenu-1" switch ON.

- [ ] "Submenu A" reappears with its default children ("Sub A.1"
      and "Sub A.2").

31. Toggle the "include submenu-2" switch OFF.

- [ ] "Submenu B" disappears. Only "Top Item" and "Submenu A"
      remain.

32. Toggle the "include submenu-2" switch ON.

- [ ] "Submenu B" reappears with "Sub B.1" and "Deep"
      (containing "Deep.1").

---

### Deeply nested submenu — commands at depth

33. Set target id = `deep-1`, title = `Title X`,
    hidden/menuTitle = `no change`. Tap **Send Command**.

- [ ] Open Submenu B > Deep: the item now reads "Title X".

34. Tap "Title X".

- [ ] "Last clicked" updates to `deep-1`.

35. Set target id = `deep-menu`, title = `Title X`,
    hidden/menuTitle = `no change`. Tap **Send Command**.

- [ ] Open Submenu B: the nested submenu now reads "Title X"
      instead of "Deep".

36. Set target id = `deep-menu`, menuTitle = `Header X`,
    title = `no change`, hidden = `no change`.
    Tap **Send Command**.

- [ ] Open Submenu B > "Title X" (from step 35): the submenu
      header reads "Header X" instead of "Title X" (the title
      fallback).

37. In **Menu Structure — Props**, toggle "include submenu-2" OFF
    and back ON.

- [ ] Open Submenu B: its submenu header reads "Submenu B"
      (title fallback — props rebuild). Open Deep: its submenu
      header reads "Deep" (title fallback — props rebuild).
      "Deep.1" is restored.
