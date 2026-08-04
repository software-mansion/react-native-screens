# Test Scenario: Stack Toolbar Menu Icon

## Details

**Description:** Tests the `icon` and state-aware `iconTintColor*` props on
Android toolbar menu items. Covers both the props flow (via `toolbarMenu`
prop) and the imperative command flow (via `updateToolbarMenuElements`). The
props flow rebuilds all items from scratch on every update and discards all
prior command state on all items simultaneously. The command flow merges changes
onto individual items: absent fields preserve the current value; fields set to
`default` reset to the regular default (not to the last value received from
props); changes to one item never touch others.

**OS test creation version:** Android: API Level 36

## E2E test

TBD: E2E coverage has not been determined yet.

## Prerequisites

- Android emulator or device
- To test `iconTintColorFocused`: enable **Hardware Input** in the emulator
  settings, then use arrow keys to enable keyboard focus and press **Ctrl+Tab**
  to move keyboard focus into the header toolbar.

## Note

- All three items start with `showAsAction = always` and `icon = imageSource`,
  so they appear as action buttons directly in the toolbar (not in the overflow
  menu).
- `imageSource` uses `search_black.png` (black icon, transparent background).
  `drawableResource` uses `sym_call_missed` (native white-and-red colors).
  Applying any tint color completely overrides the icon's native colors.
- **Native platform limitation:** if `iconTintColorNormal` is left at its
  default (undefined) but any other state tint (`Pressed`, `Focused`,
  `Disabled`) is explicitly set, the icon becomes invisible in the normal state.
  This is Android platform behavior, not a library bug. Always set
  `iconTintColorNormal` alongside other state tints if you want the icon visible
  in the normal state.

## Steps

### Baseline — initial render from props

1. Launch the app and navigate to **Stack Toolbar Menu Icon**.

- [ ] The header shows three action icon buttons in the toolbar. Each displays
      the `search_black.png` icon (black on transparent background). No tint is
      applied; all icons show their default colors.

---

### Props — icon type

2. In **Menu Items — Props**, change Slot 1 `icon` to `drawableResource`.

- [ ] Item 1 changes to the `sym_call_missed` drawable (white and red). Items 2
      and 3 remain `search_black.png`.

3. Change Slot 1 `icon` to `none`.

- [ ] Item 1 shows "ITEM 1" text and no icon. Items 2 and 3 are unchanged.

4. Change Slot 1 `icon` back to `imageSource`.

- [ ] Item 1 returns to `search_black.png`.

---

### Props — tint color (Normal state)

5. Change Slot 1 `tintColorNormal` to `purple`.

- [ ] Item 1 icon turns purple. Items 2 and 3 are unchanged.

6. Change Slot 1 `tintColorNormal` to `red`.

- [ ] Item 1 icon turns red immediately.

7. Change Slot 1 `tintColorNormal` back to `default`.

- [ ] Item 1 icon returns to its original black color (no tint).

---

### Props — multiple state tints (Normal + Pressed + Focused + Disabled)

8. Change Slot 2 `tintColorNormal` to `purple`, then `tintColorPressed` to
   `green`, then `tintColorFocused` to `red`, then `tintColorDisabled` to
   `blue`.

- [ ] Normal: Item 2 shows purple.
- [ ] Pressed: Press and hold Item 2 — it turns green while pressed.
- [ ] Focused: Use Ctrl+Tab to move keyboard focus to the toolbar, navigate to
      Item 2 — it turns red while focused.

9. Toggle Slot 2 `disabled` on.

- [ ] Disabled: Item 2 shows the **blue** disabled tint. Tapping Item 2 does
      nothing. Items 1 and 3 stay enabled and unaffected.

10. Toggle Slot 2 `disabled` back off.

- [ ] Item 2 returns to its enabled appearance, showing purple at rest again.

11. Change Slot 2 `tintColorNormal`, `tintColorPressed`, `tintColorFocused`, and
    `tintColorDisabled` all back to `default`.

- [ ] Item 2 returns to its original default appearance in all interaction
      states.

---

### Props — native limitation: non-Normal tint without Normal tint

12. Change Slot 3 `tintColorPressed` to `red` (leave `tintColorNormal` at
    `default`).

- [ ] Item 3 icon becomes **invisible** in the normal state (Android platform
      behavior: setting any state-specific tint without a Normal tint causes the
      icon to disappear at rest). The tint is visible when Item 3 is pressed.

13. Change Slot 3 `tintColorNormal` to `purple`.

- [ ] Item 3 icon becomes visible again, showing purple at rest and red when
      pressed.

14. Change Slot 3 `tintColorNormal` and `tintColorPressed` back to `default`.

- [ ] Item 3 returns to its untinted `search_black.png` appearance.

---

### Props — icon removed while tint is set

15. Change Slot 3 `tintColorNormal` to `green`, then change Slot 3 `icon` to
    `none`.

- [ ] Item 3 shows no icon.

16. Change Slot 3 `icon` back to `imageSource`.

- [ ] Item 3 shows `search_black.png` with green tint already applied. The tint
      was preserved while the icon was absent.

17. Change Slot 3 `tintColorNormal` to `default`.

- [ ] Item 3 returns to untinted `search_black.png`.

---

### Commands — no-op

18. In **Send Command**, set target id = `item-1`, all fields = `no change`. Tap
    **Send Command**.

- [ ] No visible change. All items appear exactly as before.

---

### Commands — single tint color change

19. Set target id = `item-1`, `tintColorNormal` = `red`, all others = `no
    change`. Tap **Send Command**.

- [ ] Item 1 turns red. Items 2 and 3 are unchanged.

20. Set target id = `item-2`, `tintColorNormal` = `purple`, all others = `no
    change`. Tap **Send Command**.

- [ ] Item 2 turns purple. Items 1 and 3 are unchanged.

---

### Commands — native limitation: non-Normal tint without Normal tint

21. Set target id = `item-3`, `tintColorPressed` = `green`, all others = `no
    change`. Tap **Send Command**.

- [ ] Item 3 becomes **invisible** in the normal state (same platform behavior
      as in steps 12–13). It is visible (green) when pressed.

22. Set target id = `item-3`, `tintColorNormal` = `purple`, all others = `no
    change`. Tap **Send Command**.

- [ ] Item 3 becomes visible again, showing purple at rest and green when
      pressed.

---

### Commands — restore single tint color to default

23. Set target id = `item-1`, `tintColorNormal` = `default`, all others = `no
    change`. Tap **Send Command**.

- [ ] Item 1 returns to no tint (original colors).

---

### Commands — multiple tint colors (Normal + Pressed + Focused + Disabled)

24. Set target id = `item-3`, `tintColorNormal` = `green`, `tintColorPressed` =
    `red`, `tintColorFocused` = `purple`, `tintColorDisabled` = `blue`, all
    others = `no change`. Tap **Send Command**.

- [ ] Normal: Item 3 shows green. Item 2 still shows purple from step 20. Item 1
      is at default.
- [ ] Pressed: Press and hold Item 3 — it turns red.
- [ ] Focused: Use Ctrl+Tab and keyboard to focus Item 3 — it turns purple.

25. Set target id = `item-3`, `disabled` = `true`, all others = `no change`. Tap
    **Send Command**.

- [ ] Item 3 shows the **blue** disabled tint. Tapping Item 3 does nothing.

26. Set target id = `item-3`, `disabled` = `false`, all others = `no change`.
    Tap **Send Command**.

- [ ] Item 3 returns to its enabled appearance, showing green at rest again.

---

### Commands — partial restore (change one, restore another, preserve third)

27. Set target id = `item-3`, `tintColorNormal` = `purple`, `tintColorPressed` =
    `no change`, `tintColorFocused` = `no change`. Tap **Send Command**.

- [ ] Item 3 normal tint changes to purple. `tintColorPressed` (red) and
      `tintColorFocused` (purple) are preserved — they were absent from the
      options object. Pressing Item 3 still shows red.

28. Set target id = `item-3`, `tintColorNormal` = `no change`,
    `tintColorPressed` = `default`, `tintColorFocused` = `no change`. Tap
    **Send Command**.

- [ ] Item 3 normal tint remains purple (preserved). `tintColorPressed` is
      cleared — pressing Item 3 now shows purple (falling back to
      `tintColorNormal`) instead of the previous red. `tintColorFocused`
      remains purple (preserved).

---

### Commands — change icon only (tint colors preserved)

29. Set target id = `item-2`, `icon` = `drawableResource`, all tint fields = `no
    change`. Tap **Send Command**.

- [ ] Item 2 changes to the `sym_call_missed` icon. Its `tintColorNormal`
      remains purple from step 20 — the drawable is shown in purple.

---

### Commands — change icon and tint color simultaneously

30. Set target id = `item-1`, `icon` = `drawableResource`, `tintColorNormal` =
    `green`, all others = `no change`. Tap **Send Command**.

- [ ] Item 1 changes to `sym_call_missed` and simultaneously turns green.

---

### Commands — restore tint color only (icon preserved)

31. Set target id = `item-1`, `tintColorNormal` = `default`, `icon` = `no
    change`. Tap **Send Command**.

- [ ] Item 1 `tintColorNormal` resets to the regular default (no tint). The icon
      remains `drawableResource` — it was not included in the options object.

---

### Commands — restore icon to none, then restore with stored tint

32. Set target id = `item-1`, `icon` = `none`, `tintColorNormal` = `no change`.
    Tap **Send Command**.

- [ ] Item 1 shows no icon.

33. Set target id = `item-1`, `tintColorNormal` = `red`, `icon` = `no change`.
    Tap **Send Command**.

- [ ] Item 1 still shows no icon. The tint is stored but invisible.

34. Set target id = `item-1`, `icon` = `imageSource`, `tintColorNormal` = `no
    change`. Tap **Send Command**.

- [ ] Item 1 shows `search_black.png` with red tint (the `tintColorNormal` set
      in step 33 was preserved while the icon was absent and becomes visible
      once the icon is restored).

---

### Commands — props update resets all command state

35. At this point all three items have command overrides applied (icon and/or
    tint changes from steps 19–34). In **Menu Items — Props**, change Slot 1
    `tintColorNormal` from `default` to `purple` and then immediately back to
    `default`.

- [ ] Both prop changes trigger a full menu rebuild. All command-applied
      overrides (icon and tint changes) are discarded for all three items
      simultaneously. Items 1, 2, and 3 all revert to their props-configured
      state: `search_black.png`, no tint.

---

### Commands — restore resets to global default, not prop value

36. In **Menu Items — Props**, change Slot 1 `tintColorNormal` to `purple`.

- [ ] Item 1 shows purple.

37. Set target id = `item-1`, `tintColorNormal` = `red`, all others = `no
    change`. Tap **Send Command**.

- [ ] Item 1 changes to red (command override on top of the purple prop value).

38. Set target id = `item-1`, `tintColorNormal` = `default`, all others = `no
    change`. Tap **Send Command**.

- [ ] Item 1 shows **no tint** — the icon returns to its original colors. This
      is the global default, not the prop value: the prop still specifies
      `tintColorNormal = purple` for Slot 1, but the command's `default` resets
      to the regular default (no tint) rather than restoring purple.

39. In **Menu Items — Props**, change Slot 1 `tintColorNormal` back to
    `default`.

- [ ] Item 1 remains untinted (no visible change — command already set the
      override to the global default).

---

### Commands — excluded item safe targeting

40. In **Menu Items — Props**, toggle Slot 2 `include` to `false`.

- [ ] Item 2 disappears from the toolbar.

41. Set target id = `item-2`, `icon` = `drawableResource`, `tintColorNormal` =
    `red`. Tap **Send Command**.

- [ ] No crash. Items 1 and 3 are unaffected.

42. Toggle Slot 2 `include` back to `true`.

- [ ] Item 2 reappears with its props-configured appearance (`search_black.png`,
      no tint). The command from step 41 did not leak into the re-included slot.
