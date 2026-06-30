# Test Scenario: Stack Toolbar Menu Title

## Details

**Description:** This test focuses on the title-related Android toolbar
menu item props on the gamma stack header: `title`, `titleCondensed` and
`tooltipText`. It verifies where each one renders and how they relate:
`titleCondensed` is the label shown on the **Toolbar action button**
(falling back to `title`), `tooltipText` is the **long-press / hover
tooltip** of a Toolbar button (falling back to `title`), and the full
`title` is always used in the **overflow menu**. It also verifies the
text with icon appears only if there is room (visible in landscape, hidden
in portrait on a phone).

**OS test creation version:** Android: API Level 36

## E2E test

TBD — automation is possible and planned but not yet implemented.

## Prerequisites

- Android emulator (phone)

## Note

- `titleCondensed` only affects the **Toolbar action button** text. The
  overflow menu always shows the full `title`. When `titleCondensed` is
  unset, the button uses `title`.
- `tooltipText` only affects the long-press tooltip of a **Toolbar
  button**. It has no effect on overflow rows. When unset, the tooltip
  falls back to `title`.
- Text-with-icon "if room": when an item has both an icon and a
  `*WithText` action, the text label is shown next to the icon only when
  there is room — on a phone this means it appears in **landscape** and is
  hidden in **portrait**. An item with text but **no icon** always shows
  its text.
- Changing any **Props** control rebuilds the whole menu and discards any
  prior `setToolbarMenuItemOptions` state.

## Steps

### Baseline — initial render

1. Launch the app and navigate to **Stack Toolbar Menu Title** (in
   portrait).

- [ ] Header reads "Title / Condensed / Tooltip". The Toolbar shows two
      icon buttons (`item-1` and `item-2`) plus an overflow button (⋮).
      `item-1`'s "Cond" text is **not** shown next to its icon in portrait.

2. Open the overflow menu (⋮).

- [ ] One row is present reading the full title "Third Item Long Title"
      (`item-3`) — the condensed "Short" is **not** used in the overflow.

---

### titleCondensed on the Toolbar button (no icon)

3. Set **Slot 1** `icon` = `undefined` (keep `showAsAction` =
   `alwaysWithText`, `titleCondensed` = `Cond`).

- [ ] `item-1` now appears as a **text** button reading "Cond" (the
      condensed title), not "First Item".

4. Set **Slot 1** `titleCondensed` = `undefined`.

- [ ] The button text falls back to the full title "First Item".

5. Set **Slot 1** `titleCondensed` = `Cond`, then `showAsAction` =
   `never`.

- [ ] `item-1` moves into the overflow menu. Its overflow row reads the
      full title "First Item" — the condensed "Cond" is **not** used.

---

### titleCondensed with an icon depends on room (orientation)

6. Set **Slot 1** `icon` = `searchIcon`, `showAsAction` =
   `alwaysWithText`, `titleCondensed` = `Cond`. Keep portrait.

- [ ] `item-1` shows the **icon only**.

7. Rotate the device to **landscape**.

- [ ] `item-1` now shows the icon **and** the "Cond" label beside it.

8. Rotate back to **portrait**.

- [ ] The label is hidden again (icon only).

---

### tooltipText on a Toolbar icon button

9. Long-press `item-2`'s icon button (default: no `tooltipText`).

- [ ] A tooltip appears reading the full title "Second Item Title"
      (tooltip falls back to `title`).

10. Set **Slot 2** `tooltipText` = `Tooltip text`, then long-press
    `item-2`.

- [ ] The tooltip now reads "Tooltip text".

11. Set **Slot 2** `tooltipText` = `undefined`, then long-press `item-2`.

- [ ] The tooltip falls back to "Second Item Title" again.

12. Set **Slot 2** `showAsAction` = `never`, `tooltipText` =
    `Tooltip text`. Open the overflow menu.

- [ ] `item-2` is a normal overflow row reading "Second Item Title"; the
      `tooltipText` has no effect on overflow rows.

---

### Imperative command — set and reset

13. Set **Slot 1** `icon` = `undefined`, `showAsAction` =
    `alwaysWithText`, `titleCondensed` = `Cond`.

- [ ] `item-1` Toolbar button reads "Cond".

14. In **Send Command**, set target id = `item-1`, titleCondensed =
    `Short`, title = `no change`, tooltipText = `no change`. Tap **Send
    Command**.

- [ ] The button text updates live to "Short".

15. Send Command: target id = `item-1`, titleCondensed = `undefined`
    (reset).

- [ ] The button text falls back to the full title "First Item".

16. Send Command: target id = `item-1`, title = `Cmd Title`,
    titleCondensed = `no change`.

- [ ] The button text becomes "Cmd Title" (no condensed set, so `title`
      is used).

17. Set **Slot 2** `showAsAction` = `always`. Then Send Command:
    target id = `item-2`, tooltipText = `Hi!`. Long-press `item-2`'s icon button.

- [ ] The tooltip reads "Hi!".

18. Send Command: target id = `item-2`, tooltipText = `undefined`
    (reset). Long-press `item-2`.

- [ ] The tooltip falls back to "Second Item Title".
