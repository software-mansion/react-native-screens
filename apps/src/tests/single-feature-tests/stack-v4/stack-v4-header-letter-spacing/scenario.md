# Test Scenario: Header Letter Spacing

## Details

**Description:** Verify letter spacing in the Stack v4 native header:
`titleLetterSpacing`, `largeTitleLetterSpacing` (iOS), `backTitleLetterSpacing`
(iOS) and bar button item `titleStyle.letterSpacing` (iOS). Pass: each value
changes only its own text at runtime, the text returns to its default spacing
when the value is omitted, and the spacing stays with custom fonts, the
collapsed title (iOS) and after navigation.

**OS test creation version:** iOS 18.6, iOS 26.5 and iOS 27.2, Android API 36

## E2E test

TBD: the spacing changes are a few points wide and need screenshot comparison,
which is not set up for this scenario yet.

## Prerequisites

- iOS simulator or device.
- Android emulator or device.

## Note

- Open Single feature tests → Stack v4 → **Header Letter Spacing** once per
  platform; each group continues where the previous one ended.
- iOS: `0` turns off the font's kerning, so "WAVY Today" is wider at `0` than
  at "Spacing: omitted".
- **Known issue:** Android: after "Custom typography" is set back to `false`,
  the title keeps the custom font.

## Steps - iOS

### Spacing values

1. Tap "Cycle spacing: omitted / 0 / -0.9 / 2" until "Spacing: 0" is shown.

   - [ ] The large title "WAVY Today" is wider than at "Spacing: omitted"; gaps
         open up between "W", "A", "V" and "Y" (see Note).

2. Tap "Cycle spacing: omitted / 0 / -0.9 / 2" until "Spacing: -0.9" is shown.

   - [ ] The large title and "Edit" are narrower than at "Spacing: omitted".

3. Tap "Cycle spacing: omitted / 0 / -0.9 / 2" until "Spacing: 2" is shown.

   - [ ] The large title and "Edit" are wider than at "Spacing: omitted".

4. Set "Apply to large title (iOS)" to `false`.

   - [ ] The large title looks as at "Spacing: omitted"; "Edit" stays wide.

5. Set "Apply to bar button item (iOS)" to `false`.

   - [ ] "Edit" looks as at "Spacing: omitted".

6. Set "Apply to large title (iOS)" and "Apply to bar button item (iOS)" to
   `true`, then tap "Cycle spacing: omitted / 0 / -0.9 / 2" until
   "Spacing: omitted" is shown.

   - [ ] The header looks as it did when the screen opened.

7. Set "Custom typography" to `true`, then tap
   "Cycle spacing: omitted / 0 / -0.9 / 2" until "Spacing: 2" is shown.

   - [ ] The large title uses a smaller font than in step 6, with its letters
         spread wide.

---

### Collapse

1. Make sure "Spacing: 2" is shown, then scroll down until the large title
   collapses into the bar.

   - [ ] The title "WAVY Today" in the bar has its letters spread wide.

2. Set "Custom typography" to `false`.

   - [ ] The title in the bar gets smaller, with its letters still spread wide.

3. Scroll back to the top.

   - [ ] The large title is shown again with its letters spread wide.

---

### Back button

1. Make sure "Spacing: 2" is shown, then tap "Push details".

   - [ ] The title "Details" and the back button title "WAVY Today" have their
         letters spread wide.

2. Set "Apply to back title (iOS)" to `false`.

   - [ ] The back button title is narrower than in step 1; "Details" keeps its
         letters spread wide.

3. Set "Apply to back title (iOS)" to `true` and "Apply to title" to `false`,
   then tap "Cycle spacing: omitted / 0 / -0.9 / 2" until "Spacing: -0.9" is
   shown.

   - [ ] "Details" is narrower than in step 1.
   - [ ] The back button title is tight, and the back button is narrower than
         in step 1.

4. Set "Custom typography" to `true`, then tap
   "Cycle spacing: omitted / 0 / -0.9 / 2" until "Spacing: 2" is shown.

   - [ ] "Details" uses a bigger font than in step 3.
   - [ ] The back button title is bold with its letters spread wide.

5. Set "Custom typography" to `false`.

   - [ ] The back button title is regular weight again, with its letters still
         spread wide.

6. Tap the back button, set "Disable back button menu (iOS)" to `true`, then
   tap "Push details".

   - [ ] The back button title "WAVY Today" has its letters spread wide.

## Steps - Android

### Spacing values

1. Tap "Cycle spacing: omitted / 0 / -0.9 / 2" until "Spacing: 0" is shown.

   - [ ] The title "WAVY Today" looks as at "Spacing: omitted".

2. Tap "Cycle spacing: omitted / 0 / -0.9 / 2" until "Spacing: -0.9" is shown.

   - [ ] The title is narrower than at "Spacing: omitted".

3. Tap "Cycle spacing: omitted / 0 / -0.9 / 2" until "Spacing: 2" is shown.

   - [ ] The title is wider than at "Spacing: omitted".

4. Set "Apply to title" to `false`.

   - [ ] The title looks as at "Spacing: omitted".

5. Set "Apply to title" to `true`, then tap
   "Cycle spacing: omitted / 0 / -0.9 / 2" until "Spacing: omitted" is shown.

   - [ ] The title looks as it did when the screen opened.

---

### Navigation

1. Tap "Cycle spacing: omitted / 0 / -0.9 / 2" until "Spacing: 2" is shown,
   then tap "Push details".

   - [ ] The title "Details" has its letters spread wide.

2. Tap "Cycle spacing: omitted / 0 / -0.9 / 2" until "Spacing: -0.9" is shown.

   - [ ] "Details" is narrower than in step 1.

3. Tap the back arrow in the header.

   - [ ] "WAVY Today" is shown, narrower than at "Spacing: omitted".

---

### Custom font

1. Set "Custom typography" to `true`, then tap
   "Cycle spacing: omitted / 0 / -0.9 / 2" until "Spacing: 2" is shown.

   - [ ] The title is bigger and bolder than in step 3 of **Navigation**, with
         its letters spread wide.
