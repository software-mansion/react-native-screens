# Test Scenario: Tabs Screen Orientation

## Details

**Description:** Validates the `orientation` prop on `TabsScreen`, which constrains
the interface orientations a tab screen supports. The picker cycles the active tab
between `portrait`, `landscape`, and `undefined` (the default, which behaves as
`inherit`), and the device should lock to the selected orientation.

**OS test creation version:** iOS 26.5

## E2E test

TBD — not automated. Orientation locking depends on the native UIKit responder
chain and on physical device rotation, which Detox cannot drive reliably across
size classes. Manual verification on a device/simulator is required.

## Prerequisites

- iOS device or simulator (iPhone)

## Note

> **Known limitations — this prop is not universally supported.**
> Please read these caveats before drawing conclusions from the test results.

- **iOS Only (iPhone only for testing):** The `orientation` prop is currently iOS-only.
There is no Android binding yet, though Android support is planned for the future
(see [issue #868](https://github.com/software-mansion/react-native-screens-labs/issues/868)).
- **iPad Limitations:** Orientation settings are not applied on iPad;
this behavior is tracked in [issue #1213](https://github.com/software-mansion/react-native-screens-labs/issues/1213).
- **Inconsistent iPhone Behavior:** For options other than `landscape`, `portrait`,
and `undefined`, the orientation behavior is inconsistent. This is tracked in
[issue #1212](https://github.com/software-mansion/react-native-screens-labs/issues/1212).
- **Current Test Scope:** Due to the limitations above, only a few options work
as expected on iPhone, and only those specific options are covered in this scenario.

*This scenario and test screen will be extended in the future once the current
limitations are resolved and the Android implementation is delivered.*

## Steps

### Baseline

1. Launch the app on an **iPhone** and navigate to the **Tabs Screen Orientation**
   screen.

- [ ] **Tab1** is selected. The `orientation` picker defaults to `undefined`.

---

### `portrait`

2. Set `orientation` to `portrait`, then rotate the device to landscape.

- [ ] The screen stays locked to portrait; it does not rotate to landscape.

---

### `landscape`

3. Set `orientation` to `landscape`.

- [ ] The screen rotates to and locks in landscape orientation.

4. Rotate the device back toward portrait.

- [ ] The screen stays locked to landscape; it does not return to portrait.

---

### `undefined` (default / inherit)

5. Set `orientation` back to `undefined` and rotate the device.

- [ ] The screen adapts to the default device orientation, with no explicit
per-screen lock applied.
