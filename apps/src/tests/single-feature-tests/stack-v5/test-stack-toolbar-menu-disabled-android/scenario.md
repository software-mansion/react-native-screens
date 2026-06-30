# Test Scenario: Stack Toolbar Menu Disabled

## Details

**Description:** Tests the `disabled` prop on Android toolbar menu items.
Covers all disable-relevant element kinds — an action button shown in the
toolbar (`showAsAction: always`), an action item in the overflow menu
(`showAsAction: never`), checkable items in a selection group, and a
submenu — across both flows: the props flow (via the `toolbarMenu` prop)
and the imperative command flow (via `setToolbarMenuItemOptions`). A
disabled element is greyed out and ignores interaction: it emits neither
`onPress` nor `onSelectionChange`, a disabled submenu cannot be opened,
and a disabled checked item keeps its checked state. The props flow
rebuilds all items from scratch on every update; the command flow merges
a change onto a single item (absent field = no change, `undefined` =
reset to the default enabled state).

**OS test creation version:** Android: API Level 36

## E2E test

TBD: E2E coverage has not been determined yet.

## Prerequisites

- Android emulator or device

## Note

- The menu contains: `action-bar` (toolbar action button with the
  `search_black.png` icon), `action-overflow` (overflow action item),
  `opt-a` and `opt-b` (checkable items in the `options` group, `opt-a`
  starts checked), `submenu` (the "More" submenu) and `sub-item` (a leaf
  inside it).
- `options` is a multi-select (checkbox) group, so `opt-a` and `opt-b`
  toggle independently.
- The **Last Event** line shows the most recent `onPress` /
  `onSelectionChange`. "Does not update" below means the previous text
  stays unchanged — disabled elements fire no events.
- Overflow items, `opt-*`, and `sub-item` are reached by tapping the
  three-dot overflow icon (and then "More" for `sub-item`).

## Steps

### Baseline — initial render from props

1. Launch the app and navigate to **Stack Toolbar Menu Disabled**.

- [ ] The toolbar shows the `action-bar` icon button and a three-dot
      overflow icon. All elements are enabled (full-opacity). The overflow
      menu lists Action Overflow, Option A (checked), Option B, and More.

---

### Props — disabled action item (toolbar button)

2. In **Menu Items — Props**, toggle `disable action-bar (toolbar
   button)` on.

- [ ] The `action-bar` icon button greys out (reduced opacity).

3. Tap the greyed `action-bar` button.

- [ ] Nothing happens. **Last Event** does not update (no `onPress`).

4. Toggle `disable action-bar` back off.

- [ ] The button returns to full opacity and tapping it again sets
      **Last Event** to `Pressed: action-bar`.

---

### Props — disabled action item (overflow)

5. Toggle `disable action-overflow` on, then open the overflow menu.

- [ ] The **Action Overflow** row is greyed out.

6. Tap the greyed **Action Overflow** row.

- [ ] Nothing happens (the menu may stay open). **Last Event** does not
      update.

7. Toggle `disable action-overflow` back off.

- [ ] Opening the overflow menu and tapping **Action Overflow** now sets
      **Last Event** to `Pressed: action-overflow`.

---

### Props — disabled checkable items

8. Open the overflow menu and tap **Option B** once to check it.

- [ ] **Option B** becomes checked. **Last Event** shows
      `options: ["opt-a","opt-b"]`.

9. Toggle `disable opt-b (checkable)` on, then open the overflow menu and
   tap **Option B**.

- [ ] **Option B** is greyed but stays **checked**. Tapping it does not
      change the check and **Last Event** does not update.

10. Toggle `disable opt-a (checkable, checked)` on, open the overflow
    menu and tap **Option A**.

- [ ] **Option A** is greyed but stays **checked** (its checked state is
      preserved while disabled). Tapping it does nothing and **Last
      Event** does not update.

11. Toggle `disable opt-a` and `disable opt-b` back off.

- [ ] Both rows return to full opacity, retain their checked states, and
      tapping either one toggles it and updates **Last Event** again.

---

### Props — disabled submenu

12. Toggle `disable submenu` on, then open the overflow menu.

- [ ] The **More** row is greyed out.

13. Tap the greyed **More** row.

- [ ] The submenu does **not** open.

14. Toggle `disable submenu` back off and open **More**.

- [ ] The submenu opens and shows **Sub Item**.

---

### Props — disabled item inside a submenu

15. Toggle `disable sub-item` on, open the overflow menu, then open
    **More**.

- [ ] **Sub Item** is greyed out.

16. Tap the greyed **Sub Item**.

- [ ] Nothing happens. **Last Event** does not update.

17. Toggle `disable sub-item` back off.

- [ ] Opening **More** and tapping **Sub Item** now sets **Last Event**
      to `Pressed: sub-item`.

---

### Commands — disable via command

18. In **Send Command**, set target id = `action-bar`, disabled =
    `true`. Tap **Send Command**.

- [ ] The `action-bar` button greys out. Tapping it does nothing and
      **Last Event** does not update.

19. Set target id = `submenu`, disabled = `true`. Tap **Send Command**,
    then open the overflow menu.

- [ ] **More** is greyed out and cannot be opened.

20. Set target id = `opt-a`, disabled = `true`. Tap **Send Command**,
    then open the overflow menu and tap **Option A**.

- [ ] **Option A** is greyed, stays checked, and tapping it does not
      update **Last Event**.

---

### Commands — re-enable via command

21. Set target id = `action-bar`, disabled = `false`. Tap **Send
    Command**.

- [ ] The `action-bar` button returns to full opacity and tapping it sets
      **Last Event** to `Pressed: action-bar`.

---

### Commands — three-state reset (`undefined`)

22. Set target id = `submenu`, disabled = `undefined`. Tap **Send
    Command**, then open the overflow menu.

- [ ] **More** returns to enabled (reset to the default `disabled =
      false`) and opens normally. Sending `undefined` restored the
      default rather than leaving it disabled.

---

### Commands — props update rebuilds and discards command state

23. With several command-applied disables still in effect (e.g. `opt-a`
    from step 20), toggle any switch in **Menu Items — Props** off and on
    (for an item that is currently `false`).

- [ ] The whole menu rebuilds from props. All command-applied `disabled`
      overrides are discarded; every element returns to the state defined
      by the **Menu Items — Props** switches.
