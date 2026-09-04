# Test Scenario: Stack in Tabs - header persistence across tab switches

## Details

**Description:** A stack v5 nested in a tab has its fragment view destroyed and
recreated on every tab switch (tabs detach/attach the fragment). The fragment
retains its header view across that cycle, so the whole live header - app bar,
title, collapsing scroll behavior, toolbar menu state and the current scroll
offset - must come back untouched, without a visible rebuild. Configuration
changes applied while the tab is detached must still land on reattach; the ones
that force a header rebuild are covered separately, since they cannot preserve a
partial collapse offset.

**OS test creation version:** Android: API Level 37.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- Android device / emulator.
- The app draws edge to edge. The _Other_ tab always applies a `SafeAreaView`
  top inset; _Home_ applies one only while its header is hidden.

## Note

- The header is not rebuilt on a tab round trip, so its collapse state survives,
  including a partial (mid-scroll) offset. There must be no flash of an expanded
  or re-built header when the tab comes back.
- `medium` and `large` headers default to `scrollFlagSnap: true`, so the app bar
  always settles fully expanded or fully collapsed. The _Home_ screen exposes a
  **scrollFlagSnap** switch; turn it off wherever a step asks for a _partial_
  offset, and leave it on otherwise so the default configuration is the one
  under test.
- Known limitation: a change that forces a header rebuild while the tab is
  detached (`type`, `hidden`, subviews, or a color scheme switch) re-asserts
  only the _fully_ collapsed resting state on reattach. A partially collapsed
  header returns expanded in that case. Delta-only changes (e.g. the title)
  keep the exact offset.
- Toolbar menu selections live in native state owned by the configuration, so
  they survive the round trip.
- Known issue: popping in the nested stack (step 19) finishes the activity,
  because `TabsContainer` does not set the primary navigation fragment. Until
  that lands, treat the step as blocked rather than failed.

## Steps

### Baseline

1. Launch the app and navigate to the **Stack in Tabs - header persistence
   across tab switches** screen.

- [ ] The _Stack_ tab is selected and shows the _Home_ screen with a `medium`
      collapsing header titled _Home v1_, subtitle _Tab persistence_, and an
      overflow menu button.

2. Scroll the content down and up.

- [ ] The header collapses and expands with the content (collapsing scroll
      behavior works).

---

### Header survives a tab round trip

3. Switch to the _Other_ tab and back to _Stack_.

- [ ] The _Home_ header is still present: title _Home v1_, subtitle, overflow
      menu button.

4. Scroll the content down and up again.

- [ ] Collapsing scroll behavior still works after the round trip.

5. Repeat steps 3-4 a few times.

- [ ] The header is present after every round trip.

---

### Scroll offset survives a tab round trip

6. With **scrollFlagSnap** left on (the default), scroll until the header is
   fully collapsed. Switch to the _Other_ tab and back.

- [ ] The header is still fully collapsed. It does not come back expanded, and
      there is no flash of a re-built header.

7. Turn **scrollFlagSnap** off, then scroll until the header is _partially_
   collapsed and release.

- [ ] The header rests part-way instead of snapping to an edge.

8. Switch to the _Other_ tab and back.

- [ ] The header comes back at exactly the same partial offset - no jump to
      expanded, no rebuild flash.

9. Turn **scrollFlagSnap** back on.

- [ ] The header snaps to fully expanded (a scroll-flag change resets the app
      bar) and snapping behavior is restored.

---

### Menu state survives

10. Open the overflow menu.

- [ ] _Filter A_ is checked, _Filter B_ is unchecked.

11. Tap _Filter B_, then switch to the _Other_ tab and back. Open the overflow
    menu.

- [ ] Both _Filter A_ and _Filter B_ are checked (the selection made before
      switching away survived; "Last menu selection" lists both).

---

### Delta change while detached

12. Turn **scrollFlagSnap** off and scroll the header to a _partial_ collapse.
    Switch to the _Other_ tab, tap **Change Home title**, and switch back to
    _Stack_.

- [ ] The header title reads _Home v2_ **and** the header is still at the same
      partial offset - a title change is applied to the live header, not a
      rebuild.

---

### Rebuild while detached

13. Still with **scrollFlagSnap** off, scroll the header to a _partial_
    collapse. Switch to the _Other_ tab, change **type** under _Header rebuild
    triggers_ from `medium` to `large`, and switch back to _Stack_.

- [ ] The header is rebuilt with the new type, and it comes back **expanded**.
      Losing a partial offset across a rebuild is the documented limitation, not
      a failure.

14. Turn **scrollFlagSnap** back on and scroll the header to a _full_ collapse.
    Switch to the _Other_ tab, change **type** again from `large` to `medium`,
    and switch back.

- [ ] The header is rebuilt with the new type and is still fully collapsed.

15. Scroll the header to a _full_ collapse, switch to the _Other_ tab, toggle
    **trailing subview** on, and switch back.

- [ ] A grey _T_ subview is shown in the trailing slot of the toolbar, and the
      header is still fully collapsed.

16. Switch to the _Other_ tab, toggle **hidden** on, and switch back.

- [ ] The _Home_ screen has no header at all, and its content starts below the
      status bar (the `SafeAreaView` top edge takes over from the header).

17. Switch to the _Other_ tab, toggle **hidden** off and **trailing subview**
    off, and switch back.

- [ ] The header is back, **expanded**, with the _T_ subview gone, and the
      content no longer carries the top inset. A header that was actually
      removed always comes back expanded - the collapse memory is dropped
      together with the app bar. (Toggling **hidden** on and off again without
      visiting _Stack_ in between never removes the header, so in that case the
      collapse state is kept.)
- [ ] Scrolling collapses and expands the header as before.

---

### Pushed screen

18. On the _Stack_ tab, tap **Push Details**. Switch to the _Other_ tab and
    back.

- [ ] The _Details_ header is present after the round trip.

19. Navigate back to _Home_.

- [ ] The _Home_ header is present with the current title and the offset it had
      before the push. (See the known issue in **Note**.)

---

### With a color scheme override

20. Set **StackHost color scheme** to the opposite of the current device scheme
    (e.g. `dark` on a light device).

- [ ] The header re-themes to the selected scheme.

21. Scroll the header to a _full_ collapse. While on the _Other_ tab, change the
    override (e.g. back to `inherit`), then switch back to _Stack_.

- [ ] The header shows up already using the new scheme and is still fully
      collapsed (a scheme change forces a rebuild, so a _partial_ offset would
      be lost here - see **Note**).
