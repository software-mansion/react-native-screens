# Test Scenario: Stack Header Mode

## Details

**Description:** Tests `headerMode`. With `float` (default), all screens share
one navigation bar and only its content is swapped during transitions. With
`screen`, the screen renders its own navigation bar, which is a part of the
screen and slides together with it.

On Android every screen always renders its own header, so both values behave
the same (as `screen`).

**OS test creation version:** iOS 26.5, Android 15 (API 35)

## E2E test

TBD.

## Prerequisites

- iOS simulator / Android emulator

## Steps

### iOS

1. Launch the test screen. Home uses `float`, First and Second use `screen`.
  - "Home (float)" is displayed in the shared navigation bar
  - "Top of Home content" is visible right below the navigation bar
2. Tap `Push First`.
  - The shared navigation bar slides away together with Home's content,
    while First comes in with its own navigation bar ("First (screen)",
    back button, info item)
  - "Top of First content" is visible right below First's navigation bar
  - Tapping the info item increases "info item pressed" counter
3. Tap `Push Second`.
  - Both navigation bars are visible during the transition: First's bar
    moves with First, Second's bar moves with Second
4. Swipe from the left edge to go back, stop half way and release.
  - Both screens' bars follow the gesture
  - Second stays on top with its own navigation bar; a full swipe afterwards
    still pops it
5. Tap the back button of Second's navigation bar.
  - Second is popped (the same as with the shared navigation bar)
6. Under First (current), switch `headerMode` to `float`.
  - First's own navigation bar is removed, the shared navigation bar shows
    "First (float)" with the back button and the info item
7. Switch it back to `screen` and toggle `hidden`.
  - The navigation bar is hidden and content moves up under the status bar
8. Under Home, switch `headerMode` to `screen` and pop back to Home.
  - Home displays its own navigation bar without the back button

### Android

1. Launch the test screen and push First, then Second.
  - Every screen's header moves together with the screen during
    transitions, regardless of `headerMode`
