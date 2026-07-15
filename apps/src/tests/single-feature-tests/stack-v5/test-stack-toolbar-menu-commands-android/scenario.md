# Test Scenario: Stack Toolbar Menu Commands

## Details

**Description:** This test focuses on the Android toolbar menu items API
on the gamma stack header — both the `toolbarMenu` prop and the
imperative `setToolbarMenuElementOptions(id, options)` command. It verifies
that the menu renders correctly from props on first mount, that the
per-item `onPress` callback fires with the correct id, and that
imperative commands behave as specified: fields absent from `options`
preserve their current value, fields set to `undefined` (encoded as
`null` over the bridge) reset to the prop's regular default (not to the
value last seen from props), and any props update rebuilds the entire
menu — discarding all prior command-applied state across all items, not
just the slot whose prop changed.

**OS test creation version:** Android: API Level 36

## E2E test

Other — automation is not implemented yet.

## Prerequisites

- Android emulator or device

## Note

- `StackHeaderToolbarMenuElementOptionsAndroid` semantics:
  - A field missing from the options object means "preserve current
    value".
  - A field set to `undefined` (sent over the bridge as `null`) means
    "reset to the regular default for this prop" — this is not the
    same as restoring the value last received from props.
- Imperative commands target items by `id`. Targeting an id that is not
  currently in the menu (slot excluded via `include: false`, or unknown
  id) must not crash and must not leak state into other items.
- A props update on any single slot rebuilds the entire
  `toolbarMenu` children array, so all command-applied overrides on every
  item are dropped at the same time.

## Steps

### Baseline — initial render from props

1. Launch the app and navigate to **Stack Toolbar Menu Commands**.

- [ ] Header title reads "Toolbar Menu Commands Test". The
      toolbar overflow menu shows three items in order: "Title A",
      "Title B", "Title C", all visible.

2. Open the menu and tap "Title A".

- [ ] Menu closes. "Last clicked" updates to `item-1`.

3. Open the menu and tap "Title C".

- [ ] "Last clicked" updates to `item-3`.

---

### Imperative command — "no change" is a no-op

4. In the **Send Command** section, set target id = `item-1`,
   title = `no change`, hidden = `no change`. Tap **Send Command**.

- [ ] No visible change. Menu still shows "Title A",
      "Title B", "Title C".

---

### Imperative command — change title only

5. Set target id = `item-2`, title = `Changed`, hidden = `no change`.
   Tap **Send Command**.

- [ ] Item 2 in the menu now reads "Changed". Items 1
      ("Title A") and 3 ("Title C") are unchanged.

6. Tap "Changed" in the menu.

- [ ] "Last clicked" updates to `item-2` (id is stable across
      title changes).

---

### Imperative command — change hidden only (earlier title preserved)

7. Set target id = `item-2`, title = `no change`, hidden = `true`.
   Tap **Send Command**.

- [ ] Item 2 disappears from the menu. Only "Title A" and
      "Title C" remain.

8. Set target id = `item-2`, title = `no change`, hidden = `false`.
   Tap **Send Command**.

- [ ] Item 2 reappears and still reads "Changed" (the title
      set in step 5 was preserved because `title` was absent from both
      step 7 and step 8 options).

---

### Imperative command — reset hidden to its regular default

9. Set target id = `item-1`, title = `no change`, hidden = `true`.
   Tap **Send Command**.

- [ ] Item 1 ("Title A") disappears. Menu shows "Changed" and
      "Title C".

10. Set target id = `item-1`, title = `no change`, hidden = `undefined`.
    Tap **Send Command**.

- [ ] Item 1 reappears with "Title A". The `hidden` override
      is cleared and the prop falls back to its regular default
      (visible). Note this is the regular default, not the value
      previously received from props — they happen to coincide in this
      case (both result in a visible item).

---

### Props update — replaces command state across ALL items

11. Set target id = `item-1`, title = `Long Title`, hidden = `no change`.
    Tap **Send Command**.

- [ ] Item 1 reads "Long Title". Item 2 still reads "Changed"
      (carried over from step 5 / step 8). Item 3 reads "Title C".

12. In **Menu Items — Props**, change Slot 3 title from `Title C` to
    `Long Title`.

- [ ] Item 3 reads "Long Title" (direct props change). At the
      same time, Item 1 reverts to its props-configured "Title A"
      (losing the "Long Title" override applied in step 11) and Item 2
      reverts to its props-configured "Title B" (losing the "Changed"
      override applied in step 5). All command state is gone.

13. Change Slot 3 title back to `Title C`.

- [ ] Item 3 reads "Title C". Items 1 and 2 still show their
      props-configured titles ("Title A", "Title B").

---

### Excluded / unknown id — safe targeting

14. In **Menu Items — Props**, toggle Slot 3 `include = false`.

- [ ] Item 3 ("Title C") disappears. Menu shows "Title A" and
      "Title B".

15. Set command target id = `item-3`, title = `Changed`,
    hidden = `false`. Tap **Send Command**.

- [ ] No visible change. No crash. Items 1 and 2 are
      unaffected.

16. Toggle Slot 3 `include = true`.

- [ ] Item 3 reappears with "Title C" (the props-configured
      title), NOT "Changed". The command from step 15 did not leak
      into the re-included slot.
