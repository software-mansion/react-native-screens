# Test Scenario: Stack Toolbar Menu Show As Action

## Details

**Description:** This test covers the `showAsAction` prop on Android
toolbar menu items. It verifies that items placed in the action bar
vs overflow menu behave correctly for all five values: `never`,
`always`, `alwaysWithText`, `ifRoom`, `ifRoomWithText`. It also
verifies that the default (omitted prop) is equivalent to `never`,
and that runtime updates via `setToolbarMenuItemOptions` — including
resetting to the default with `undefined` — take effect immediately.
The test exercises the interaction between `showAsAction` and the
`icon` prop, since the `WITH_TEXT` modifier only has a visible
effect when an icon is present.

**OS test creation version:** Android: API Level 36

## E2E test

Other — automation is not implemented yet.

## Prerequisites

- Android emulator or device

## Note

The `WITH_TEXT` modifier (`alwaysWithText`, `ifRoomWithText`) requests
that the item's text title be displayed alongside its icon in the
toolbar. On Android this text-alongside-icon layout only takes effect
in **landscape** orientation. In portrait the toolbar shows the icon
without text — visually identical to `always` / `ifRoom`.

Without an icon, `always` vs `alwaysWithText` and `ifRoom` vs
`ifRoomWithText` are indistinguishable: the item shows its title as
a text action in both cases.

Icons are never shown in the overflow menu. Regardless of the `icon`
prop, overflow items display only their text title.

The number of `ifRoom` / `ifRoomWithText` items that fit in the
toolbar is determined on first layout and is not updated on subsequent
orientation changes. If the app starts in landscape the toolbar is
wider, so more items may be promoted but rotating to portrait will not
hide the items (the title bar may shrink instead); if it starts in
portrait, rotating to landscape will not promote additional items.

## Steps

### Baseline — default is equivalent to `never`

1. Launch the app and navigate to **Stack Toolbar Menu Show As
   Action**.

- [ ] Header title reads "Show As Action Test". The toolbar shows
      only the overflow (⋮) icon — no items appear as direct action
      buttons. Open the overflow menu: three items are listed ("I1",
      "Item 2", "Item Number Three").

2. Open the overflow menu and tap "I1".

- [ ] Menu closes. "Last clicked" updates to `item-1`.

3. Open the overflow menu and tap "Item Number Three".

- [ ] "Last clicked" updates to `item-3`.

---

### Props — explicit `never`

4. In **Menu Items — Props**, change Slot 1 `showAsAction` from
   `undefined` to `never`.

- [ ] Item 1 remains in the overflow menu — identical to the
      default behaviour.

---

### Props — icon in overflow

5. Set Slot 1 `icon` to `searchIcon` (leave `showAsAction` at
   `never`). Open the overflow menu.

- [ ] "I1" appears as text only — no icon is shown. Icons are not
      displayed in the overflow menu.

---

### Props — `always`

6. Change Slot 1 `showAsAction` to `always`.

- [ ] The search icon appears directly in the toolbar as an action
      button. The text "I1" is not shown — the icon replaces it when
      an icon is set. The overflow menu now contains only "Item 2"
      and "Item Number Three".

7. Tap the search icon action button in the toolbar.

- [ ] "Last clicked" updates to `item-1`.

---

### Props — `alwaysWithText`

8. Change Slot 1 `showAsAction` to `alwaysWithText`. Ensure the
   device is in **portrait** orientation.

- [ ] "I1" appears in the toolbar as a search icon action button —
      no text is visible next to the icon. Visually identical to
      `always` in portrait.

9. Rotate the device to **landscape**.

- [ ] "I1" now shows the search icon with the text "I1" beside it.
      This text-alongside-icon layout is the distinguishing effect
      of the `WITH_TEXT` modifier; it only appears in landscape.

10. Rotate back to **portrait**.

- [ ] "I1" returns to icon-only display.

---

### Props — `ifRoom`

11. Reset Slot 1 `icon` to `undefined`. Change all three slots to
    `ifRoom` (Slot 1, Slot 2, Slot 3).

- [ ] Items that fit within the available toolbar space appear as
      action buttons; the rest fall back to the overflow menu.
      Exact count depends on screen width.

---

### Props — `ifRoomWithText`

12. Set all three slots: `icon` = `searchIcon`,
    `showAsAction` = `ifRoomWithText`. Ensure the device is in
    **portrait** orientation.

- [ ] Items that fit in the toolbar show as icon-only action
      buttons (no text beside the icons). Items that overflow
      appear in the menu as text only (no icons).
- [ ] Rotate to landscape: promoted items now show their icon
      with text title beside it.

13. Rotate back to portrait. Reset all three slots: `icon` =
    `undefined`, `showAsAction` = `undefined`.

- [ ] All items return to the overflow menu. The toolbar shows
      only the overflow (⋮) icon.

---

### Runtime command — `never` → `always`

14. Verify the overflow menu shows "I1", "Item 2",
    "Item Number Three" and no action buttons are visible.

15. In **Send Command**, set target id = `item-1`,
    showAsAction = `always`. Tap **Send Command**.

- [ ] "I1" immediately moves from the overflow menu to the
      toolbar as a text action button without any prop change.

16. In **Send Command**, set target id = `item-1`,
    icon = `searchIcon`, showAsAction = `no change`. Tap
    **Send Command**.

- [ ] "I1" in the toolbar changes from a text action button to a
      search icon action button. The `showAsAction = always`
      override from step 15 is preserved.

---

### Runtime command — `always` → `never`

17. Set target id = `item-1`, showAsAction = `never`,
    icon = `no change`. Tap **Send Command**.

- [ ] "I1" moves back to the overflow menu. Open the overflow
      menu: "I1" appears as text only — the icon set in step 16
      is not visible in the overflow menu.

---

### Runtime command — reset to default via `undefined`

18. Set target id = `item-2`, showAsAction = `always`. Tap
    **Send Command**.

- [ ] "Item 2" appears as a toolbar action button.

19. Set target id = `item-2`, showAsAction = `undefined`. Tap
    **Send Command**.

- [ ] "Item 2" returns to the overflow menu. The `showAsAction`
      override is cleared and falls back to the regular default
      (`never`).
