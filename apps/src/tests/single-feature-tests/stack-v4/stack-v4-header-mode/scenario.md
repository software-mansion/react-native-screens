# Test Scenario: Header Mode

## Details

**Description:** Tests the `headerMode` header config prop of Stack v4. With
`float` (default), all screens share the navigation bar of the stack and only
its content is swapped during transitions. With `screen`, the screen renders
its own navigation bar, which is a part of the screen and slides together with
it.

On Android every screen always renders its own header, so both values behave
the same.

**OS test creation version:** iOS 26.5, Android 15 (API 35)

## E2E test

TBD.

## Prerequisites

- iOS simulator / Android emulator

## Note

- Every screen has a custom right header item ("Tap",
  `ScreenStackHeaderRightView`). Tapping it increases the "header right item
  pressed" counter of the screen.
- "onHeaderHeightChange" shows the last header height reported by the screen.

## Steps

### iOS

1. Launch the test screen. Home uses `float`, First and Second use `screen`.

- [ ] "Home (float)" is displayed in the shared navigation bar.
- [ ] "Top of Home content" is visible right below the navigation bar.

2. Tap `Push First`.

- [ ] The shared navigation bar slides away together with Home's content,
      while First comes in with its own navigation bar ("First (screen)",
      back button, "Tap" item).
- [ ] "Top of First content" is visible right below First's navigation bar.
- [ ] "onHeaderHeightChange" shows the same value as on Home.
- [ ] Tapping "Tap" increases the "header right item pressed" counter.

3. Tap `Push Second`.

- [ ] Both navigation bars are visible during the transition: First's bar
      moves with First, Second's bar moves with Second.

4. Swipe from the left edge to go back, stop half way and release.

- [ ] Both screens' bars follow the gesture.
- [ ] Second stays on top with its own navigation bar; a full swipe
      afterwards pops it.

5. Push Second again and tap the back button of Second's navigation bar.

- [ ] Second is popped, the same as with the shared navigation bar.

6. On First, under "First (current)", switch `headerMode` to `float`.

- [ ] First's own navigation bar is removed, the shared navigation bar shows
      "First (float)" with the back button and the "Tap" item.

7. Switch it back to `screen` and turn on `hidden`.

- [ ] The navigation bar is hidden, the content moves up under the status bar
      and "onHeaderHeightChange" shows `0`.

8. Turn off `hidden`, swipe back to Home.

- [ ] First's bar leaves together with First, Home's shared navigation bar is
      revealed underneath.

### Android

1. Launch the test screen and push First, then Second.

- [ ] Every screen's header moves together with the screen during
      transitions, regardless of `headerMode`.
