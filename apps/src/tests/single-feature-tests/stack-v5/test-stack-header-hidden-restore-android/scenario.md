# Test Scenario: Stack header hidden restore

## Details

**Description:** Re-showing a hidden stack v5 header must restore the collapse
state. The rule under test: the header comes back **fully collapsed** when the
content is scrolled away from the top and **expanded** otherwise, independent
of the configured scroll flags. This prevents the broken shape of an expanded
app bar pushed above content that is scrolled into its middle, for every
scroll-flag combination, including a header that was hidden from the moment
its screen mounted.

**OS test creation version:** Android: API Level 37.

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- Android device / emulator.

## Note

- Defaults: `large` header with `scrollFlagScroll`,
  `scrollFlagExitUntilCollapsed` and `scrollFlagSnap` on - the stack's
  default collapsing configuration. Steps that change the type or flags say
  so and restore the defaults afterwards.
- The re-show rule drops state the content position cannot testify to: a
  collapse that existed while the content was at the top comes back expanded,
  (with **scrollFlagSnap** off) a _partial_ offset always resets, and a
  header re-entered above scrolled content via **scrollFlagEnterAlways** -
  the whole header, or just its toolbar when
  **scrollFlagEnterAlwaysCollapsed** is also on - comes back fully
  collapsed. All of these are expected results below, not failures.
- While the header is hidden the content starts below the status bar (a
  `SafeAreaView` top inset takes over).
- Scroll-flag steps only use valid combinations
  (`scrollFlagEnterAlwaysCollapsed` requires `scrollFlagEnterAlways`; both
  are meaningful only with `scrollFlagExitUntilCollapsed` off).
- A `small` header cannot collapse while `scrollFlagExitUntilCollapsed` is on
  (its pinned height equals its full height), which is why the small-header
  step turns that flag off.
- When `medium/large` header with `scrollFlagExitUntilCollapsed: false` is
  re-shown, its status bar scrim flashes (it fades in). This is a known issue.

## Steps

### Baseline

1. Launch the app and navigate to the **Stack header hidden restore** screen.

- [ ] The _Home_ screen shows a `large` collapsing header titled _Hidden
      restore_; scrolling collapses and expands it.

---

### Re-show with the content at the top

2. Scroll until the header is fully collapsed while the content is still at
   the top, then toggle **hidden** on and off.

- [ ] While hidden there is no header and the content starts below the status
      bar.
- [ ] The header comes back **expanded** - a collapse that existed while the
      content was at the top is dropped (see **Note**).

---

### Re-show with the content scrolled

3. Scroll down until the header collapses and the content itself is visibly
   scrolled, then toggle **hidden** on and off.

- [ ] The header comes back **fully collapsed** (pinned toolbar only) - it is
      not expanded above mid-scrolled content, and the content is not pushed
      down by the full header height.

4. With the header expanded and the content at the top, toggle **hidden** on,
   scroll the content down a little, then toggle **hidden** off.

- [ ] The header comes back **fully collapsed**.

5. With the header collapsed and the content scrolled, toggle **hidden** on,
   scroll the content back to the top, then toggle **hidden** off.

- [ ] The header comes back **expanded**.

---

### Rebuild while hidden

6. With the header collapsed and the content scrolled, toggle **hidden** on,
   change **type** to `medium`, then toggle **hidden** off.

- [ ] The header comes back as a `medium` header, **fully collapsed** - a
      rebuild request arriving while hidden does not disturb the rule.

7. Set **type** back to `large` and scroll the content back to the top.

- [ ] The header is expanded again (a type change resets the offset when the
      content is at the top).

---

### Scroll-flag variants

Each step: set the flags as listed, scroll down until the content is visibly
scrolled, toggle **hidden** on and off.

8. **scrollFlagExitUntilCollapsed** off (plain scrolling header).

- [ ] The header comes back fully collapsed - scrolled entirely off screen -
      and re-enters only once the content is scrolled back to the top.

9. **scrollFlagEnterAlways** on (with **scrollFlagExitUntilCollapsed** still
   off).

- [ ] The header comes back fully collapsed, and a small upward drag
      re-enters the whole header while the content stays mid-list.

10. With the flags from step 9, drag up so the whole header re-enters while
    the content stays scrolled, then toggle **hidden** on and off.

- [ ] The header comes back **fully collapsed** - the expanded-over-scrolled
      state is dropped (see **Note**).

11. **scrollFlagEnterAlwaysCollapsed** on as well. After checking the first
    result, drag up so the toolbar re-enters, then toggle **hidden** on and
    off again.

- [ ] The header comes back fully collapsed; an upward drag re-enters only
      the toolbar, and the full height returns only once the content reaches
      the top.
- [ ] After the second hide/re-show the re-entered toolbar is dropped: the
      header is fully collapsed again, with only the content scrim visible.

12. All scroll-flag switches off.

- [ ] The header no longer collapses while scrolling; after hiding over
      scrolled content it comes back at its full height (a header that cannot
      collapse always restores expanded).

13. Restore the defaults: **scrollFlagScroll**,
    **scrollFlagExitUntilCollapsed** and **scrollFlagSnap** on, both
    enter-always switches off.

- [ ] Collapsing behavior is back to the baseline.

---

### Partial offset

14. Turn **scrollFlagSnap** off, scroll to a _partial_ collapse with the
    content at the top, then toggle **hidden** on and off. Turn
    **scrollFlagSnap** back on afterwards.

- [ ] The header comes back **expanded** - partial offsets reset (see
      **Note**).

---

### Small header

15. Set **type** to `small` and turn **scrollFlagExitUntilCollapsed** off
    (see **Note**). Scroll down until the toolbar is gone and the content is
    scrolled, then toggle **hidden** on and off. Restore `large` and the
    flag afterwards.

- [ ] The toolbar comes back fully collapsed (still off screen) and only
      re-enters once the content is scrolled back to the top.

---

### Hidden from the start

16. Scroll to the top. Tap **Push Details**.

- [ ] The _Details_ screen has no header from the moment it appears and its
      content starts below the status bar.

17. Scroll the _Details_ content down a little, then toggle its **hidden**
    switch off.

- [ ] The header appears **fully collapsed** - the very first build of this
      header lands on scrolled content and must not expand above it.

18. Navigate back to _Home_.

- [ ] The _Home_ header still matches its state from step 15's cleanup
      (expanded, `large`), unaffected by the _Details_ round trip.
