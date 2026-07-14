# Test Scenario: Stack Toolbar Menu Batch Commands (Android)

## Details

**Description:** This test verifies the batched `updateToolbarMenuElements`
view command on the Stack v5 header for Android, which is backed by a serial
FIFO command queue. It covers: per-batch **coalescing** (one
`onToolbarMenuGroupSelectionChange` event per affected group, not one per
changed item); **atomic** application of a batch that mixes an async image load
with plain updates (applied only after the image has loaded); **FIFO ordering**
of back-to-back commands (a late image load must not override a newer command);
the single-object (non-array) normalization path.

**OS test creation version:** Android: API Level 36

## E2E test

TBD — automation is possible and planned but not yet implemented.

## Prerequisites

- Android emulator or device
- Network access (the image-load cases download from https://picsum.photos)

## Note

- A batch emits **one** event per affected group. An item already in its target
  state fires nothing; a batch that changes no item's state fires nothing (the
  "Events received" counter stays put).
- The menu's checked state is **cumulative** across button taps. **Reset log
  clears only the counter and log, not the menu** — so the steps below run as
  one linear sequence.
- Android's overflow menu does **not render item icons**, and a toolbar action
  item does **not show checkbox state**. So the image-load cases move **Apple**
  into the toolbar to make its downloaded icon visible, and its checked state is
  confirmed via the event log (or by moving Apple back to the overflow menu).
- The image cases download a large, uncached image, so the async load is
  visibly delayed. The queue guarantees hold regardless of speed — the
  behavioral assertions (single coalesced event; correct final checkbox state;
  correct ordering) are the source of truth.

## Steps

### Baseline — initial render

1. Launch the app, navigate to **Stack Toolbar Menu Batch Commands**, and open
   the overflow menu.

- [ ] Header title reads "Toolbar Menu Batch Commands Test". The overflow menu
      shows a **fruits** group — Apple (checked), Banana, Cherry, Date
      (multi-toggle) — and a **view** group — List (checked), Grid
      (single-selection). "Events received" is 0.

---

### Coalescing — one event per batch

2. Tap **Select All (1 event)**.

- [ ] Exactly **1** new event (counter → 1). Newest ▶ reads
      `fruits: ["apple","banana","cherry","date"]` — a 4-element batch yields
      one coalesced event, not 3–4.
- [ ] Overflow: all four fruits are checked.

3. Tap **Deselect All (1 event)**.

- [ ] 1 new event (counter → 2). Newest ▶ reads `fruits: []`.
- [ ] Overflow: all four fruits are unchecked.

---

### Coalescing — one event per affected group

4. Tap **Batch across groups (2 events)**.

- [ ] **2** new events (counter → 4), in update order: `fruits: ["cherry"]`
      then newest ▶ `view: ["grid"]` — one coalesced event per affected group.
- [ ] Overflow: Cherry is checked; the view group is now Grid (List unchecked —
      single-selection exclusivity).

---

### Single-object (non-array) argument

5. Tap **Single object update (1 event)**.

- [ ] 1 new event (counter → 5). Newest ▶ reads `fruits: ["banana","cherry"]` —
      the non-array argument is normalized to a one-element batch.
- [ ] Overflow: Banana and Cherry are checked.

---

### Atomic image load + `showAsAction`

6. Tap **Move Apple to toolbar**.

- [ ] **No** new event (counter stays 5). Apple leaves the overflow menu and
      appears in the app bar as a text action ("APPLE") — it has no icon yet.

7. Tap **Deselect All** to reach a clean state.

- [ ] 1 new event (counter → 6). Newest ▶ reads `fruits: []`. (Apple's checkbox
      is not visible while it is in the toolbar; the event confirms it is
      unchecked.)

8. Tap **Batch: image + check (atomic)**.

- [ ] After a short download delay, Apple's toolbar item shows the downloaded
      photo **and**, at the same moment, exactly **1** new event appears
      (counter → 7): newest ▶ `fruits: ["apple","cherry"]`.
- [ ] The event must **not** appear before the image — the whole batch (Apple's
      and Cherry's checks) is held until Apple's image loads, then applied
      together.

9. Tap **Move Apple to overflow**, then open the overflow menu.

- [ ] No new event (counter stays 7). Apple is back in the overflow menu and is
      **checked** — confirming the check applied atomically in step 8.

---

### FIFO ordering — a late image must not override a newer command

10. Tap **Deselect All** to reach a clean state (Apple unchecked).

- [ ] 1 new event (counter → 8). Newest ▶ reads `fruits: []`.

11. Tap **Ordering race (last: Apple absent)**.

- [ ] **2** new events (counter → 10): `fruits: ["apple"]` (command 1, emitted
      after its image loads) then newest ▶ `fruits: []` (command 2).
- [ ] The newest event and the overflow menu both show Apple **unchecked /
      absent**. (Without the queue, command 1's late image resolution would
      carry `checked: true` and land after command 2, wrongly re-checking
      Apple.)
