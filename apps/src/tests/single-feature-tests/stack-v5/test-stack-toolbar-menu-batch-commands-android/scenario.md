# Test Scenario: Stack Toolbar Menu Batch Commands (Android)

## Details

**Description:** This test exercises the batched `updateToolbarMenuElements`
view command on the Stack v5 Android header. It covers **coalescing** (one
`onToolbarMenuGroupSelectionChange` per affected group, not one per changed
item); **atomic** application of a batch that mixes an async image load with
plain updates (applied only once the image has loaded); **FIFO ordering** of
back-to-back commands (a late image load must not override a newer command);
the single-object (non-array) argument form; and **robustness** — a failing
image load still completes the batch and clears the icon, and a repeated id in
one batch is applied in order, with the last icon winning.

**OS test creation version:** Android: API Level 36

## E2E test

TBD — automation is possible and planned but not yet implemented.

## Prerequisites

- Android emulator or device
- Network access (the image-load cases download from https://picsum.photos)

## Note

- A batch emits **one** event per affected group. An item already in its target
  state fires nothing, and a batch that changes no item's state fires nothing
  (the "Events received" counter stays put).
- The menu's checked state is **cumulative** across taps. **Reset log clears
  only the counter and log, not the menu**, so the steps below run as one linear
  sequence.
- Android's overflow menu does **not** render item icons, and a toolbar action
  item does **not** show checkbox state. So an item's icon is only visible while
  it is in the toolbar, and its checked state is only visible while it is in the
  overflow menu — several steps below move **Apple** between the two to check
  both.
- The image cases download a large, uncached image, so the async load is
  visibly delayed.

## Steps

### Baseline — initial render

1. Launch the app, navigate to **Stack Toolbar Menu Batch Commands**, and open
   the overflow menu.

- [ ] Header title reads "Toolbar Menu Batch Commands Test". The overflow menu
      shows a **fruits** group — Apple (checked), Banana, Cherry, Date
      (multi-select) — and a **view** group — List (checked), Grid
      (single-select). "Events received" is 0.

---

### Coalescing — one event per batch

2. Tap **Select All (1 event)**.

- [ ] 1 new event (counter → 1). Newest ▶ reads
      `fruits: ["apple","banana","cherry","date"]` — the four-element batch
      yields one event, not four.
- [ ] Overflow: all four fruits are checked.

3. Tap **Deselect All (1 event)**.

- [ ] 1 new event (counter → 2). Newest ▶ reads `fruits: []`.
- [ ] Overflow: all four fruits are unchecked.

---

### Coalescing — one event per affected group

4. Tap **Batch across groups (2 events)**.

- [ ] 2 new events (counter → 4), in update order: `fruits: ["cherry"]` then
      newest ▶ `view: ["grid"]` — one event per affected group.
- [ ] Overflow: Cherry is checked, and the view group is now Grid (List
      unchecked — single-select).

---

### Single-object (non-array) argument

5. Tap **Single object update (1 event)**.

- [ ] 1 new event (counter → 5). Newest ▶ reads `fruits: ["banana","cherry"]` —
      a single object argument is treated as a one-element batch.
- [ ] Overflow: Banana and Cherry are checked.

---

### Atomic image load with `showAsAction`

6. Tap **Move Apple to toolbar**.

- [ ] No new event (counter stays 5). Apple leaves the overflow menu and appears
      in the app bar as a text button ("APPLE") with no icon.

7. Tap **Deselect All (1 event)**.

- [ ] 1 new event (counter → 6). Newest ▶ reads `fruits: []`.

8. Tap **Batch: image + check (atomic)**.

- [ ] After a short download, Apple's toolbar button shows the photo and, at the
      same moment, 1 new event appears (counter → 7): newest ▶
      `fruits: ["apple","cherry"]`. The event does not appear before the image —
      the batch (Apple's icon and check, and Cherry's check) is held until the
      image loads, then applied together.

9. Tap **Move Apple to overflow**.

- [ ] No new event (counter stays 7). Apple is back in the overflow menu and is
      checked.

---

### FIFO ordering — a late image must not override a newer command

10. Tap **Deselect All (1 event)**.

- [ ] 1 new event (counter → 8). Newest ▶ reads `fruits: []`.

11. Tap **Ordering race (last: Apple absent)**.

- [ ] 2 new events (counter → 10): `fruits: ["apple"]` (the first command, whose
      image loads slowly) then newest ▶ `fruits: []` (the second command).
- [ ] The newest event and the overflow menu both show Apple unchecked — the
      second command is applied last even though the first command's image
      resolves later.

---

### Robustness — a failing image still completes the batch

12. Tap **Failing image + follow-up**.

- [ ] 2 new events (counter → 12): `fruits: ["apple"]` then newest ▶
      `fruits: ["apple","banana"]`. The first batch checks Apple with an image
      that cannot load; the second checks Banana. Both apply — a failed image
      does not stop later commands.

13. Tap **Move Apple to toolbar**.

- [ ] No new event (counter stays 12). Apple's toolbar button shows "APPLE" with
      no icon — the failed image load leaves the icon cleared.

14. Tap **Move Apple to overflow**.

- [ ] No new event (counter stays 12). In the overflow menu Apple is checked —
      the failing-image batch applied its check.

---

### Robustness — a repeated id in one batch (last icon wins)

15. Tap **Deselect All (1 event)**.

- [ ] 1 new event (counter → 13). Newest ▶ reads `fruits: []`.

16. Tap **Move Apple to toolbar**.

- [ ] No new event (counter stays 13). Apple shows "APPLE" with no icon.

17. Tap **Duplicate id: merge + last icon**.

- [ ] The batch lists Apple twice — the first update checks it with an image
      that fails to load, the second sets a photo (and no check). After the
      downloads, Apple's toolbar button shows the **photo**: the later icon wins
      over the failed one.
- [ ] 2 new events (counter → 15): `fruits: ["apple"]` then newest ▶
      `fruits: ["apple","cherry"]`. The first event shows Apple checked — the
      check from the first update is kept even though the second update set only
      the icon. A following batch then checks Cherry.

18. Tap **Move Apple to overflow**.

- [ ] No new event (counter stays 15). In the overflow menu Apple is checked.
