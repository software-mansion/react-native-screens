# Test Scenario: Tab Bar Item Icon Tint and Size

## Details

**Description:** Validates custom tab bar item icons. On both platforms, the
`tinted` icon property decides whether the tab bar tints an icon with its
state-dependent icon color or keeps the icon's own colors. On Android,
`drawableIconSize` sets a per-tab icon size: the icon box of the whole bar is the
largest size across tabs, and each icon is inset to its own size within that box.
The active indicator auto-scales to wrap an enlarged icon box, unless
`tabBarItemActiveIndicatorWidth` / `tabBarItemActiveIndicatorHeight` set it
explicitly. On iOS, an `sfSymbol` icon falls back to a custom symbol from the app
asset catalog when no system SF Symbol matches. Verifies that runtime changes of
these properties update the icons correctly, and that unrelated tab bar item
updates (badge) keep the icons intact.

**OS test creation version:** iOS 18.6 and iOS 26.5, Android: API Level 36.

## E2E test

Incomplete: Not automated. All observable outcomes are purely visual (icon color,
icon size, active indicator size). Detox does not expose tint color, rendered image
attributes or drawable bounds of native tab bar items, so automated assertion is
not feasible.

## Prerequisites

- Android device or emulator.
- iOS device or simulator running iOS 18 or later.
- The device/simulator/emulator portrait orientation is the primary verification surface (stacked layout).

## Note

- Scenario steps are divided by platform, as test screens vary between iOS and Android.
- The `icon.png` image asset is a black glyph of the numeral **3**. A "3" in a tab
  slot is the icon rendering correctly. It is not a badge.
- "System theme color" is the default unselected icon color of the platform tab
  bar. It differs between iOS 18, iOS 26 and Android.

Android specific notes:
- The active indicator width is capped by the tab item width (item width minus
  4dp margin on each side). With five tabs on a phone in portrait the cap is
  about 74dp, so an auto-scaled pill grows in height, but not in width.
- The tab bar appearance comes from the selected tab. The tab bar height follows
  the active indicator height, so the bar gets shorter while the **Indicator**
  tab is selected. This is expected.

## Steps - iOS

### Custom SF Symbol

1. Launch the app and navigate to the **Tab Bar Item Icon Tint and Size** screen.

- [ ] Four tabs are visible in the tab bar: **Symbol**, **Image**, **Tinted**
  and **Controls**.
- [ ] The **Symbol** tab is selected by default. Its icon is the custom
  `nano.swm` symbol (Software Mansion logo), tinted **green** by the host
  `tabBarTintColor`.

---

### `imageSource` icons are untinted by default

2. Tap the **Image** tab.

- [ ] The icon renders in its original **black** color, NOT green.
- [ ] The **Symbol** tab icon renders in the system theme color.

---

### `imageSource` icon with `tinted: true`

3. Tap the **Tinted** tab.

- [ ] The icon is tinted **green**.
- [ ] The **Image** tab icon stays **black**.

---

### Runtime `tinted` change

4. Tap the **Controls** tab.

- [ ] The icon is tinted **green**.

5. Tap the **tinted** switch so it reads `tinted: false`.

- [ ] The **Controls** tab icon changes to its original **black** color.

6. Tap the **tinted** switch again so it reads `tinted: true`.

- [ ] The **Controls** tab icon is tinted **green** again.

---

### Stability check

7. Cycle through all four tabs in order, then in reverse.

- [ ] Each tab keeps its icon and tint behavior: green when selected for
  **Symbol**, **Tinted** and **Controls**; always black for **Image**.
- [ ] No crash, layout freeze, or visual artifact occurs during rapid cycling.

## Steps - Android

### Per-tab icon size

1. Launch the app and navigate to the **Tab Bar Item Icon Tint and Size** screen.

- [ ] Five tabs are visible in the tab bar: **Sized**, **Multicolor**,
  **Image**, **Indicator** and **Controls**.
- [ ] The **Sized** tab is selected by default. Its icon is the wide SWM logo,
  rendered at 44dp - visibly larger than the other icons.
- [ ] The active indicator pill auto-scales to 52dp tall and wraps the enlarged
  icon. It is NOT the default 32dp tall pill. Its width is capped (see Note).
- [ ] The **Indicator** tab star renders at the default 24dp, centered in its slot.

---

### Untinted selected drawable

2. Tap the **Multicolor** tab.

- [ ] The selected icon is the walker in its own colors (skin, dark clothes,
  gray box).
- [ ] The icon renders at 30dp: smaller than the SWM logo, larger than the star.

3. Tap the **Sized** tab.

- [ ] The unselected **Multicolor** icon is a single-color silhouette in the
  system theme color.

---

### Untinted selected image

4. Tap the **Image** tab.

- [ ] The selected icon renders in its original **black** color.

5. Tap the **Sized** tab.

- [ ] The unselected **Image** icon renders in the system theme color.

---

### Explicit active indicator size

6. Tap the **Indicator** tab.

- [ ] The selected icon is the filled star.
- [ ] The active indicator pill has the explicit 56x36dp size: narrower and
  shorter than the auto-scaled pill seen on the other tabs.
- [ ] The tab bar is shorter than on the other tabs (see Note).

7. Tap the **Sized** tab.

- [ ] The active indicator pill auto-scales to 52dp tall again.

---

### Runtime `tinted` change

8. Tap the **Controls** tab.

- [ ] The icon is a single-color walker silhouette at the default 24dp.

9. Tap the **tinted** switch so it reads `tinted: false`.

- [ ] The **Controls** icon changes to the walker in its own colors.

10. Tap the **tinted** switch again so it reads `tinted: true`.

- [ ] The **Controls** icon is a single-color silhouette again.

---

### Runtime `drawableIconSize` change

11. Select `32` in the **drawableIconSize** picker.

- [ ] The **Controls** icon grows to 32dp.
- [ ] The other tab icons do NOT change size. The 44dp icon box is unchanged.

12. Select `56` in the **drawableIconSize** picker.

- [ ] The **Controls** icon grows to 56dp.
- [ ] The icon box of the whole bar grows to 56dp. All other icons keep their
  own sizes (SWM logo 44dp, walker 30dp, star 24dp) and stay centered.
- [ ] The active indicator pill grows to 64dp tall to wrap the 56dp box.

13. Select `default` in the **drawableIconSize** picker.

- [ ] The **Controls** icon returns to 24dp.
- [ ] The icon box shrinks back to 44dp and the active indicator pill back to
  52dp tall.

---

### Unrelated item update keeps icons

14. Tap the **badgeValue** switch so it reads `badgeValue: true`.

- [ ] A badge with "1" appears on the **Controls** tab.
- [ ] All tab icons stay unchanged: same images, colors and sizes.

15. Tap the **badgeValue** switch again so it reads `badgeValue: false`.

- [ ] The badge disappears. All tab icons stay unchanged.

---

### Stability check

16. Cycle through all five tabs in order, then in reverse.

- [ ] Each tab keeps its icon, size and tint behavior on every selection.
- [ ] No crash, layout freeze, or visual artifact occurs during rapid cycling.
