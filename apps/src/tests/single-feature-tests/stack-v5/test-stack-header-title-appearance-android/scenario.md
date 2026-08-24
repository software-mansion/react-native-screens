# Test Scenario: Header Title & Subtitle Appearance (Android)

## Details

**Description:** Verifies customization of the title and subtitle text
appearance in the Android stack v5 (Material 3) header — color, font size,
font family, font weight and font style. `small` headers expose `title*` /
`subtitle*`; `medium` / `large` headers expose `expandedTitle*` /
`collapsedTitle*` / `expandedSubtitle*` / `collapsedSubtitle*`. The scenario
checks Material defaults, restoring a prop to its default at runtime, that
several customizations combine on one slot without disturbing each other, that
the title and subtitle stay distinct even with identical text or when the title
is added after the subtitle, that appearance survives the text being removed and
re-shown, `PlatformColor` resolution, and independent expanded/collapsed
appearance.

**OS test creation version:** API 36

## E2E test

Incomplete - hard to verify text appearance with Detox.

## Prerequisites

- Android emulator

## Note

- Exact default colors/sizes are derived from the Material 3 theme, so "default"
  is judged by comparing against the untouched header, not an absolute value.
- `medium` and `large` use **different** default text appearances
  (large expanded = Display Small, medium expanded = Headline Medium), so their
  baselines differ.
- The `same` option sets title and subtitle to one identical string (`Same`).
  `short` sets title = `Title` and subtitle = `Subtitle`.
- Font families use the system `serif` / `monospace` fonts (no bundled assets).
- `color` options: `red` / `blue` are literals; `platform` is
  `PlatformColor('@android:color/holo_green_light')`.
- The **Appearance** section only shows the slots relevant to the current
  `type` (small: `title` / `subtitle`; medium/large: the four expanded/collapsed
  slots). Prop values set for one family are retained but ignored by the other.
- `medium` / `large` use `scrollFlagEnterAlways`, so scrolling up even a little
  always re-expands the header — you can reach either state from any offset.
- Presets: **Reset appearance** clears every axis; **Differentiation** sets
  identical title/subtitle text with title red / subtitle blue; **PlatformColor**
  applies the OS color to both.

## Steps

### Defaults per type

1. Open the scenario (defaults: `type=small`, title `Title`, subtitle
   `Subtitle`, all appearance `default`).

- [ ] Small header renders `Title` and `Subtitle` in the standard Material 3
      styling (title larger/darker, subtitle smaller/muted). No custom color.

2. Set `type=medium`, then `type=large`.

- [ ] Each collapsing header renders with its own default title/subtitle
      appearance; large title is visibly larger than medium. No custom color.

### Small — combine customizations, then restore

3. `type=small`. Add one axis at a time to the title: `color=red`, then
   `fontSize=30`, then `fontFamily=serif`, then `fontWeight=700`, then
   `fontStyle=italic`.

- [ ] Each new axis stacks on top of the previous ones — the title ends up red,
      size 30, serif, bold and italic all at once. No earlier axis is lost when
      the next is applied. (`700` renders the same as `bold`.)

4. Watch the subtitle throughout step 3.

- [ ] Subtitle stays completely default — the title changes never touch it.

5. Set each title axis back to `default`, one at a time.

- [ ] Each axis reverts to its default while the others remain applied; after
      the last one the title is fully default again (in particular the size is a
      normal default, not tiny or oversized).

### Small — title vs subtitle differentiation

6. Tap **Differentiation** (title and subtitle both `Same`; title red, subtitle
   blue).

- [ ] Both lines read `Same`; the title line is red and the subtitle line is
      blue — distinct even though the text is identical.

7. Set `title=undefined` (only the subtitle remains), then set `title=same`
   again.

- [ ] With only the subtitle present it stays blue; when the title is added back
      it shows red on the title line, not blue. The styling maps to the correct
      slot even though the title was added to the toolbar after the subtitle.

8. Swap: set `title color=blue` and `subtitle color=red`.

- [ ] Title turns blue and subtitle red — the styling follows the slot, not the
      shared text.

### Small — appearance survives the text being toggled

9. Set `subtitle color=blue` (confirm it is blue), then `subtitle=undefined`,
   then `subtitle=short`.

- [ ] The subtitle returns blue — its appearance persisted across the text being
      cleared and re-shown. (The title showed the same behavior in step 7.)

### Small — PlatformColor

10. Tap **PlatformColor** (title and subtitle `color=platform`).

- [ ] Title and subtitle both render the OS green color.

11. Set `title color=default`.

- [ ] Title reverts to the default color; subtitle stays green (its
      `PlatformColor` is unaffected).

### Medium / large — expanded vs collapsed

12. Tap **Reset appearance**, set `type=large`, then set `expandedTitle
color=red` and `collapsedTitle color=blue`.

- [ ] Expanded title is red. Scroll the content up to collapse the header — the
      collapsed toolbar title is blue. Scroll back down a little and the header
      re-expands red. The two states are independent.

13. Set `expandedTitle fontSize=12` and `collapsedTitle fontSize=30`.

- [ ] Expanded title is smaller and the collapsed title is larger; changing one
      state's size does not affect the other.

14. Set `expandedSubtitle color=red`, `collapsedSubtitle color=blue`, and set
    both title slots back to `default`.

- [ ] Subtitle colors are independent of the title and independent per state
      (expanded subtitle red, collapsed subtitle blue).

15. Tap **Reset appearance**. Set `expandedTitle` `color=red`,
    `fontFamily=monospace`, `fontWeight=700`. Then set each of those three back
    to `default`, one at a time.

- [ ] Each removal reverts only that axis while the others remain; the
      `collapsedTitle`, `expandedSubtitle` and `collapsedSubtitle` slots stay
      default the whole time (no cross-slot bleed).
