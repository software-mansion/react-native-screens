# Test Scenario: SafeAreaView mode: padding or margin

## Details

**Description:** Tests the `mode` prop of `SafeAreaView` on a Stack v5 screen.
The `SafeAreaView` has a yellow background, white content with a badge showing
the view's frame, a red 100 × 100 box and a dark "absolute, top 8" badge
positioned absolutely 8 pt from the top of the `SafeAreaView`. With
`mode: 'padding'` (the default) the view keeps the full screen frame and
applies the insets as padding, with `mode: 'margin'` it is displaced and
shrinks instead.

**OS test creation version:** iOS: 26.5, Android: API Level 36.

## E2E test

TBD.

## Prerequisites

- iOS: iPhone simulator.
- Android: emulator.

## Note

- The `SafeAreaView` insets the bottom, left and right edges on both
  platforms. The top edge is inset on iOS always and on Android only with the
  header hidden: an inline Android header lays the content out below itself,
  and the Stack screen does not publish the header to `SafeAreaView` on
  Android yet.

## Steps

### iOS

1. Navigate to **CIT → SAV → SafeAreaView mode: padding or margin**.

    - [ ] A configuration screen with the **Mode** and **Header** pickers and a
          **Launch** button is visible below the "SafeAreaView mode" header.

2. Keep **Mode: padding** and **Header: shown**, press **Launch**.

    - [ ] The badge reads `mode padding` and the `SafeAreaView` frame starts at
          `0,0` and spans the whole screen.
    - [ ] The yellow background shows under the header and under the home
          indicator.
    - [ ] The white content starts right below the header and the red box keeps
          its 100 × 100 size.
    - [ ] The badge reads `absolute child top 8` and the "absolute, top 8" badge
          sits 8 pt from the top screen edge, under the status bar, not below
          the header.

3. Press **Toggle mode**.

    - [ ] The badge reads `mode margin`; the frame starts below the header and
          is shorter than the screen.
    - [ ] The strip under the header and the strip under the home indicator
          show the screen background instead of yellow.
    - [ ] The red box keeps its size and the "absolute, top 8" badge now sits
          8 pt below the header.

4. Press **Toggle mode** again.

    - [ ] The screen looks exactly like in step 2 (`mode padding`, full frame).

5. Press **Config**, select **Header: hidden**, press **Launch**.

    - [ ] With `mode padding` the yellow strip at the top is as tall as the
          status bar and the white content starts right below it.
    - [ ] After **Toggle mode** the frame starts below the status bar and the
          status bar strip shows the screen background.

---

### Android

1. Navigate to **CIT → SAV → SafeAreaView mode: padding or margin**.

    - [ ] A configuration screen with the **Mode** and **Header** pickers and a
          **Launch** button is visible below the "SafeAreaView mode" header.

2. Keep **Mode: padding** and **Header: shown**, press **Launch**.

    - [ ] The badge reads `mode padding` and the `SafeAreaView` frame starts at
          `0,0` and spans the whole content area below the header.
    - [ ] The yellow background shows under the navigation bar.
    - [ ] The white content starts right below the header and the red box keeps
          its 100 × 100 size.
    - [ ] The badge reads `absolute child top 8` and the "absolute, top 8" badge
          sits 8 pt below the header, at the top of the white content.

3. Press **Toggle mode**.

    - [ ] The badge reads `mode margin`; the frame still starts at the top of
          the content area but is shorter by the navigation bar.
    - [ ] The strip under the navigation bar shows the screen background
          instead of yellow.
    - [ ] The red box keeps its size and the "absolute, top 8" badge does not
          move.

4. Press **Toggle mode** again.

    - [ ] The screen looks exactly like in step 2 (`mode padding`, full frame).

5. Press **Config**, select **Header: hidden**, press **Launch**.

    - [ ] With `mode padding` the yellow strip at the top is as tall as the
          status bar and the white content starts right below it.
    - [ ] After **Toggle mode** the frame starts below the status bar and the
          status bar strip shows the screen background.
