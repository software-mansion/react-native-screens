# Test Scenario: Tab Bar Display Mode Appearance (iOS)

## Details

**Description:** Exercises the per-display-mode appearance buckets on
`TabsScreenAppearanceIOS` via `standardAppearance` and
`scrollEdgeAppearance`. The three layout buckets are:

- `stacked` — icon above title; default on iPhone portrait
  (compact-width, regular-height).
- `inline` — icon next to title; used in regular-width environments,
  e.g. landscape on iPhone Pro Max or iPad.
- `compactInline` — icon next to title; used in compact-width
  environments, e.g. landscape on iPhone Pro (non-Max).

Within each bucket, `normal` and `selected` states are covered.
`focused` is set to the same value as `selected`; `disabled` is set
to the same value as `normal`.

**Prop paths covered:**

- `standardAppearance.stacked.normal.tabBarItemTitleFontColor`
- `standardAppearance.stacked.selected.tabBarItemTitleFontColor`
- `standardAppearance.inline.normal.tabBarItemTitleFontColor`
- `standardAppearance.inline.selected.tabBarItemTitleFontColor`
- `standardAppearance.compactInline.normal.tabBarItemTitleFontColor`
- `standardAppearance.compactInline.selected.tabBarItemTitleFontColor`
- `scrollEdgeAppearance.*` — same config as `standardAppearance`

**Platform:** iOS only.

**OS test creation version:** iOS 18.x

## Visual signature per display mode

The same appearance object is applied to all four tabs (Config, Tab1,
Tab2, Tab3). Read the tab title color to identify which display mode
iOS chose:

- **Red titles** (`RedLight100` / `RedDark110`) → `stacked`
  - normal: `RedLight100` (`#ff6259`)
  - selected: `RedDark110` (`#c86364`)
- **Blue titles** (`BlueLight100` / `BlueDark120`) → `inline`
  - normal: `BlueLight100` (`#38acdd`)
  - selected: `BlueDark120` (`#126893`)
- **Green titles** (`GreenLight100` / `GreenDark120`) → `compactInline`
  - normal: `GreenLight100` (`#57b495`)
  - selected: `GreenDark120` (`#31775d`)

## E2E test

No: All verifiable effects are purely visual (tab title color in the
native tab bar). Detox has no API to read native tab bar item title
color attributes, so automated assertions are not meaningful here.
This is the same reasoning applied to the sibling scenario
`test-tabs-general-appearance-ios`.

## Prerequisites

- iOS simulator or device running **iOS 18+**.
- At least one device/simulator from each category below to exercise
  all three display modes:
  - iPhone (any model), portrait — `stacked`
  - iPhone Pro Max or iPad, landscape — `inline`
  - iPhone Pro (non-Max), landscape — `compactInline`

## Steps

### stacked mode — iPhone portrait

- Launch the app on an **iPhone** simulator in **portrait** orientation
  and navigate to **Tab Bar Display Mode Appearance (iOS)**.
- Expected: Four tabs visible (Config, Tab1, Tab2, Tab3). All
  unselected tab titles appear **red** (`RedLight100`). The selected
  tab title appears in a **darker red** (`RedDark110`). This confirms
  the `stacked.normal` and `stacked.selected` buckets are active.
- Tap Tab1, Tab2, Tab3 in turn.
- Expected: Each tapped tab's title turns darker red (`RedDark110`);
  all other tabs stay at `RedLight100`. No crash or layout shift.

---

### inline mode — iPhone Pro Max landscape or iPad landscape

- Run on an **iPhone Pro Max** (e.g. iPhone 16 Pro Max) simulator or
  an **iPad** simulator. Rotate to **landscape** orientation.
- Navigate to **Tab Bar Display Mode Appearance (iOS)**.
- Expected: All unselected tab titles appear **blue** (`BlueLight100`).
  The selected tab title appears in a **darker blue** (`BlueDark120`).
  This confirms the `inline.normal` and `inline.selected` buckets are
  active.
- Tap Tab1, Tab2, Tab3 in turn.
- Expected: Each tapped tab's title turns darker blue (`BlueDark120`);
  all other tabs stay at `BlueLight100`.

---

### compactInline mode — iPhone Pro landscape (non-Max)

- Run on an **iPhone Pro** (e.g. iPhone 16 Pro, NOT Pro Max) simulator.
  Rotate to **landscape** orientation.
- Navigate to **Tab Bar Display Mode Appearance (iOS)**.
- Expected: All unselected tab titles appear **green** (`GreenLight100`).
  The selected tab title appears in a **darker green** (`GreenDark120`).
  This confirms the `compactInline.normal` and `compactInline.selected`
  buckets are active.
- Tap Tab1, Tab2, Tab3 in turn.
- Expected: Each tapped tab's title turns darker green (`GreenDark120`);
  all other tabs stay at `GreenLight100`.

---

### Rotate between modes on the same device

- On an **iPhone Pro Max** simulator, start in portrait (red/stacked),
  then rotate to landscape (blue/inline), then rotate back to portrait.
- Expected: Title colors change to match the active display mode on
  each rotation. No crash, flicker, or stuck color after rotating back.

---

### Config tab — tabBarControllerMode picker

- On the **Config** tab, use the `tabBarControllerMode` picker to cycle
  through `automatic` → `tabBar` → `tabSidebar` (on iPad) →
  `automatic`.
- Expected: Switching the mode does not crash the app. On iPad with
  `tabSidebar`, the sidebar navigation is shown; title colors should
  still reflect the correct display-mode bucket chosen by iOS for the
  current window size class.
- Note: `tabBarControllerMode` affects whether a tab bar or sidebar is
  shown, not which `stacked`/`inline`/`compactInline` bucket is used
  within the tab bar. Its primary purpose in this scenario is to let a
  tester force a sidebar on iPad for exploratory verification.
