# Test Scenario: Stack Toolbar Menu Show As Action

## Details

**Description:** This test covers the `showAsAction` prop on Android toolbar
menu items. It verifies that items placed in the action bar vs overflow menu
behave correctly for all five values: `never`, `always`, `alwaysWithText`,
`ifRoom`, `ifRoomWithText`. It also verifies that the default (omitted prop)
is equivalent to `never`, and that runtime updates via
`setToolbarMenuItemOptions` — including resetting to the default with
`undefined` — take effect immediately.

**OS test creation version:** Android: API Level 36

## E2E test

Other — automation is not implemented yet.

## Prerequisites

- Android emulator or device

## Note

The WITH_TEXT modifier forces text labels alongside icons. Without icons (not
yet exposed), these values are indistinguishable from `always` / `ifRoom` — the
item still appears in the toolbar, showing its title as a text action.

The number of `ifRoom` / `ifRoomWithText` items that fit in the toolbar is
determined on first layout and is not updated on subsequent orientation changes.
If the app starts in landscape the toolbar is wider, so more items may be
promoted but rotating to portrait will not hide the items (the title bar may
shrink instead); if it starts in portrait, rotating to landscape will not
promote additional items.

## Steps

### Baseline — default is equivalent to `never`

1. Launch the app and navigate to **Stack Toolbar Menu Show As Action**.

- [ ] Expected: Header title reads "Show As Action Test". The toolbar
      shows only the overflow (⋮) icon — no items appear as direct
      action buttons. Open the overflow menu: three items are listed
      ("I1", "Item 2", "Item Number Three").

2. Open the overflow menu and tap "I1".

- [ ] Expected: Menu closes. "Last clicked" updates to `item-1`.

3. Open the overflow menu and tap "Item Number Three".

- [ ] Expected: "Last clicked" updates to `item-3`.

---

### Props — explicit `never`

4. In **Menu Items — Props**, change Slot 1 `showAsAction` from
   `undefined` to `never`.

- [ ] Expected: Item 1 remains in the overflow menu — identical to the
      default behaviour.

---

### Props — `always`

5. Change Slot 1 `showAsAction` to `always`.

- [ ] Expected: "I1" appears directly in the toolbar as a text
      action button. The overflow menu now contains only "Item 2" and
      "Item Number Three".

6. Tap the "I1" action button in the toolbar.

- [ ] Expected: "Last clicked" updates to `item-1`.

---

### Props — `alwaysWithText`

> TODO: The difference between `always` and `alwaysWithText` (forcing a
> text label alongside an icon) cannot be verified until icon support is
> added. This step only confirms the item appears in the toolbar.

7. Change Slot 1 `showAsAction` to `alwaysWithText`.

- [ ] Expected: "I1" still appears directly in the toolbar. Visually
      indistinguishable from `always` without an icon.

---

### Props — `ifRoom`

8. Change all three slots to `ifRoom` (Slot 1, Slot 2, Slot 3).

- [ ] Expected: Items that fit within the available toolbar space appear
      as action buttons; the rest fall back to the overflow menu. Exact
      count depends on screen width.

---

### Props — `ifRoomWithText`

> TODO: Same icon limitation as `alwaysWithText`. This step only
> confirms `ifRoomWithText` behaves like `ifRoom` without icons.

9. Change all three slots to `ifRoomWithText`.

- [ ] Expected: Behaviour matches `ifRoom` — items appear in the toolbar
      when there is room, otherwise in overflow.

---

### Runtime command — `never` → `always`

10. Reset all slots to `showAsAction = undefined` (all items in
    overflow). Verify the overflow menu shows "I1", "Item 2",
    "Item Number Three" and no action buttons are visible.

11. In **Send Command**, set target id = `item-1`,
    showAsAction = `always`. Tap **Send Command**.

- [ ] Expected: "I1" immediately moves from the overflow menu to the
      toolbar as an action button without any prop change.

---

### Runtime command — `always` → `never`

12. Set target id = `item-1`, showAsAction = `never`. Tap
    **Send Command**.

- [ ] Expected: "I1" moves back to the overflow menu.

---

### Runtime command — reset to default via `undefined`

13. Set target id = `item-2`, showAsAction = `always`. Tap
    **Send Command**.

- [ ] Expected: "Item 2" appears as a toolbar action button.

14. Set target id = `item-2`, showAsAction = `undefined`. Tap
    **Send Command**.

- [ ] Expected: "Item 2" returns to the overflow menu. The
      `showAsAction` override is cleared and falls back to the regular
      default (`never`).
