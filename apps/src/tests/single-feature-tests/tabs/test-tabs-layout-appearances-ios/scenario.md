# Test Scenario: Tab Bar Layout Appearances (iOS)

## Details

**Description:** Exercises `tabBarItemTitleFontStyle` (`italic` / `normal`)
across all three display-mode buckets (`stacked`, `inline`, `compactInline`)
and both item states (`normal` unselected, `selected`).

`tabBarItemTitleFontColor` is used as the visual discriminator — color
identifies which display-mode bucket is active:

- **Red**  → `stacked`
- **Blue** → `inline`
- **Green** → `compactInline`

The `selected` state is configured with `tabBarItemTitleFontStyle: 'italic'`
and the `normal` state is using system default: `tabBarItemTitleFontStyle: 'normal'`
(normal), so the tester can verify both font-style transitions on each tab tap.

**OS test creation version:** iOS 18.6 and iOS 26.5.

## E2E test

Incomplete: All verifiable outcomes are visual — font style (italic vs.
normal) and font color of native tab bar item labels. Detox does not expose
typographic attributes or color values of native `UITabBarItem` title labels,
making automated assertion infeasible. Manual verification on a physical or
simulated device is required for all steps.

## Prerequisites

- iOS simulator or device running **iOS 18**, and a second simulator or
  device running **iOS 26**.
- For full coverage of all three display modes:
  - iPhone (any) in portrait → `stacked`
  - iPhone Pro Max in landscape → `inline` (iOS 18 or lower only)
  - iPhone Pro (non-Max) in landscape → `compactInline`
  - On **iOS 26**, landscape iPhone Pro Max also use `compactInline`
    instead of `inline`

## Note

- On **iOS 26**, the `normal` (unselected) state appearance is not applied
  to unselected tabs. All unselected tabs adopt a system-default appearance.
  Therefore the normal / colored label on unselected tabs is only observable
  on iOS 18.
- On **iOS 26**, configuring the `inline` bucket has no visible effect on
  iPhone because the system never activates the `inlineLayoutAppearance` on
  that platform version. Testers should not expect blue titles to appear on
  an iPhone running iOS 26.  Instead, the `compactInline` configuration is displayed.
- Icon color is set to the system default: blue for the selected tab, and
  black or gray for unselected tabs, depending on the iOS version.

## Steps

### stacked mode — iPhone portrait

1. Launch the app and navigate to the **Tab Bar Layout Appearances (iOS)**
   screen. Use an **iPhone** simulator in **portrait** orientation.

- [ ] Four tabs are visible (Info, Tab1, Tab2, Tab3). The first
  tab (Info) is selected by default. Its title **"Info"** should appear in
  a **red** italic font. On iOS18, unselected tabs
  should have normal (non-italic) titles in **darker red**.
  On iOS 26, unselected tab titles revert to the system
  default appearance (not red).

2. Tap **Tab1**.

- [ ] "Tab1" title becomes **italic** and **red**.
  On iOS18, the previously selected "Info" tab title becomes normal
  and darker red. On iOS 26, "Info" tab use system
  default appearance.

3. Tap **Tab2**, then **Tab3**, then back to **Tab1**.

- [ ] Each selected tab displays an italic, red title.
  All other tabs display normal titles (iOS 18: darker red, iOS 26: system
default color)

---

### compactInline mode — iPhone Pro landscape (non-Max)

4. On an **iPhone Pro** simulator, rotate to **landscape** and navigate to the screen.

- [ ] Selected tab title appears in the **italic**, **green**.
Unselected tab titles: display normal, on iOS 18: darker green, on iOS 26: system
default color.

5. Tap **Tab1**, **Tab2**, **Tab3** in turn.

- [ ] Each tapped tab's title becomes italic and green. All other tab
(unselected) display normal titles, on iOS 18: darker green, on iOS 26: system
default color.

---

### Rotate between modes — stacked ↔ compactInline (on iPhone Pro)

6. On an **iPhone Pro** simulator, start in portrait (red stacked),
   then rotate to landscape (green compactInline), then rotate back to portrait.

- [ ] Title colors and italic/normal styles update instantly with each
rotation to match the newly active layout appearance.

---

### iOS 18 only: inline mode — iPhone Pro Max landscape

7. On an **iPhone Pro Max**,
   rotate to **landscape** orientation and navigate to the screen.

- [ ] Selected tab title appears in the **italic**, **blue**.
Unselected tab titles: display normal, darker blue.

8. Tap **Tab1**, **Tab2**, **Tab3** in turn.

- [ ] Each tapped tab's title becomes italic and blue.
Unselected tabs remain normal and darker blue.

---

### iOS 18 only: Rotate between modes — stacked ↔ inline (iPhone Pro Max)

9. On an **iPhone Pro Max** simulator, start in portrait (red stacked),
   then rotate to landscape (blue inline), then rotate back to portrait.

- [ ] Title colors and italic/normal styles update instantly with each
rotation to match the newly active layout appearance.
