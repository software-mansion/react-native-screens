# Test Scenario: Stack Toolbar Menu Batch Commands (Android)

## Details

**Description:** This test verifies the batch
`updateToolbarMenuElements` view command on the Stack v5 header
for Android. It covers sending multiple menu element updates in a
single bridge call, including select all, deselect all, partial
selection, and the single-object (non-array) normalization path.

**OS test creation version:** Android: API Level 36

## E2E test

TBD — automation is possible and planned but not yet implemented.

## Prerequisites

- Android emulator or device

## Note

- Each element update in a batch that actually changes the checked
  state fires a separate `onSelectionChange` event (and toast). If
  an item is already in the desired state, no event fires for that
  item. The toasts appear in iteration order with progressively
  updated selection.

## Steps

### Baseline — initial render

1. Launch the app and navigate to **Stack Toolbar Menu Batch
   Commands**. Open the overflow menu.

- [ ] Header title reads "Toolbar Menu Batch Commands Test". The
      overflow menu shows 4 items: Apple (checked), Banana,
      Cherry, Date. All belong to a multi-toggle group.

---

### Batch: Select All

2. Tap **Select All**.

- [ ] 3 toasts appear (apple was already checked, so no change
      for it):
      `fruits: ["apple","banana"]`,
      `fruits: ["apple","banana","cherry"]`,
      `fruits: ["apple","banana","cherry","date"]`.
- [ ] "Last event" text reads
      `fruits: ["apple","banana","cherry","date"]`.
- [ ] Open the overflow menu: all 4 items are checked.

---

### Batch: Deselect All

3. Tap **Deselect All**.

- [ ] 4 toasts appear (one per item):
      `fruits: ["banana","cherry","date"]`,
      `fruits: ["cherry","date"]`,
      `fruits: ["date"]`,
      `fruits: []`.
- [ ] "Last event" text reads `fruits: []`.
- [ ] Open the overflow menu: all 4 items are unchecked.

---

### Batch: Select Specific

4. Tap **Select Apple & Cherry**.

- [ ] 2 toasts appear (banana and date were already unchecked):
      `fruits: ["apple"]`,
      `fruits: ["apple","cherry"]`.
- [ ] "Last event" text reads `fruits: ["apple","cherry"]`.
- [ ] Open the overflow menu: Apple and Cherry are checked. Banana
      and Date are unchecked.

---

### Single object (non-array) path

5. Tap **Select Banana (single object)**.

- [ ] 1 toast appears: `fruits: ["apple","banana","cherry"]`.
- [ ] "Last event" text reads
      `fruits: ["apple","banana","cherry"]`.
- [ ] Open the overflow menu: Apple, Banana, and Cherry are
      checked. Date is unchecked.
