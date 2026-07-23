# Test Scenario: Stack Toolbar Menu Disabled

## Details

**Description:** Tests the `disabled` prop on Android toolbar menu items. Covers
all disable-relevant element kinds — an action button shown in the toolbar
(`showAsAction: always`), an action item in the overflow menu (`showAsAction:
never`), checkable items in a selection group, and a submenu — across both
flows: the props flow (via the `toolbarMenu` prop) and the imperative command
flow (via `updateToolbarMenuElements`). A disabled element is greyed out/correct
tint is applied and ignores interaction: it emits neither `onPress` nor
`onSelectionChange`, a disabled submenu cannot be opened, and a disabled checked
item keeps its checked state.

**OS test creation version:** Android: API Level 36

## E2E test

TBD: E2E coverage has not been determined yet.

## Prerequisites

- Android emulator or device

## Note

- The **Last Event** line shows the most recent `onPress` /
  `onSelectionChange`. "Does not update" below means the previous text
  stays unchanged — disabled elements fire no events.
- The props flow rebuilds the menu from scratch on every update,
  resetting toggle states to their initial values (`opt-a` checked,
  `opt-b` unchecked).

## Steps

### Baseline — initial render from props

1. Launch the app and navigate to **Stack Toolbar Menu Disabled**.

- [ ] The toolbar shows the `action-bar` icon button and a three-dot
      overflow icon. All elements are enabled. The overflow menu lists
      Action Overflow, Option A (checked), Option B, and More.

---

### Props — disabled action item (toolbar button)

2. In **Menu Items — Props**, toggle `disable action-bar (toolbar
   button)` on.

- [ ] The `action-bar` icon button changes tint to a lighter color.

3. Tap the disabled `action-bar` button.

- [ ] Nothing happens. **Last Event** does not update (no `onPress`).

4. Toggle `disable action-bar` back off.

- [ ] The icon returns to its normal tint color and tapping it again
      sets **Last Event** to `Pressed: action-bar`.

---

### Props — disabled action item (overflow)

5. Toggle `disable action-overflow` on, then open the overflow menu.

- [ ] The **Action Overflow** row is greyed out.

6. Tap the greyed **Action Overflow** row.

- [ ] Nothing happens (the menu may stay open). **Last Event** does
      not update.

7. Toggle `disable action-overflow` back off.

- [ ] Opening the overflow menu and tapping **Action Overflow** now
      sets **Last Event** to `Pressed: action-overflow`.

---

### Props — disabled checkable items

8. Toggle `disable opt-a (checkable, checked)` on, then open the
   overflow menu.

- [ ] **Option A** is greyed but remains **checked** (its initial
      toggle state is preserved while disabled).

9. Tap the greyed **Option A**.

- [ ] Nothing happens. **Last Event** does not update.

10. Toggle `disable opt-b (checkable)` on, then open the overflow
    menu.

- [ ] **Option B** is greyed and **unchecked**. Tapping it does
      nothing and **Last Event** does not update.

11. Toggle `disable opt-a` and `disable opt-b` back off.

- [ ] Both rows return to normal. **Option A** is checked,
      **Option B** is unchecked (their initial states). Tapping
      either one toggles it and updates **Last Event**.

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

- [ ] Opening **More** and tapping **Sub Item** now sets **Last
      Event** to `Pressed: sub-item`.

---

### Commands — disable via command

18. In **Send Command**, set target id = `action-bar`, disabled =
    `true`. Tap **Send Command**.

- [ ] The `action-bar` icon changes tint to a lighter color. Tapping
      it does nothing and **Last Event** does not update.

19. Set target id = `submenu`, disabled = `true`. Tap **Send
    Command**, then open the overflow menu.

- [ ] **More** is greyed out and cannot be opened.

20. Set target id = `opt-a`, disabled = `true`. Tap **Send Command**,
    then open the overflow menu and tap **Option A**.

- [ ] **Option A** is greyed, stays checked, and tapping it does not
      update **Last Event**.

---

### Commands — re-enable via command

21. Set target id = `action-bar`, disabled = `false`. Tap **Send
    Command**.

- [ ] The `action-bar` icon returns to its normal tint color and
      tapping it sets **Last Event** to `Pressed: action-bar`.

---

### Commands — three-state reset (`undefined`)

22. Set target id = `submenu`, disabled = `undefined`. Tap **Send
    Command**, then open the overflow menu.

- [ ] **More** returns to enabled (reset to the default `disabled =
      false`) and opens normally. Sending `undefined` restored the
      default rather than leaving it disabled.
