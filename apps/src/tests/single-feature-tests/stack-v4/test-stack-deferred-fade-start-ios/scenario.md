# Deferred fade start

This scenario uses `ScreenStack` and `ScreenStackItem` directly. It needs no
React Navigation option forwarding or shared-element library.

Open **Single feature tests → Stack v4 → Deferred fade start** on iOS and press
**Run native checks**. Alternatively, render `TestStackDeferredFadeStartIOS`
from `apps/src/tests/single-feature-tests` directly in `apps/App.tsx`.

The screen runs ten checks and shows the result of each one. The destination
must lay out while native progress stays below 0.001 until the gate is released.
The normal fade duration is 300 ms. A JavaScript timer simulates application
readiness; production consumers should release after their actual layout and
presentation acknowledgment.

| Check                              | Expected result                                                                   |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| Release after 650 ms               | Source remains visible while the destination lays out; fade starts after release. |
| Early release                      | Releasing before native setup completes does not hang the push.                   |
| No JS release                      | Native fallback starts the fade after approximately one second.                   |
| Remove destination during hold     | No crash or stuck navigation.                                                     |
| Remove whole stack during hold     | No crash; a fresh stack can subsequently push.                                    |
| Release after removal              | A new push can still hold and release normally.                                   |
| `stackAnimation="none"`            | Not deferred.                                                                     |
| Nonpositive duration               | Not deferred. Existing duration fallback still applies.                           |
| Default slide                      | Not deferred.                                                                     |
| Fade with the option omitted/false | Existing behavior, without a preparation hold.                                    |

Run the suite again to check repeated removal and return. Leaving this test
while it is running must not update its React state after unmount.

## Before and after

These screenshots were captured in a standalone version of the same probe on
patched Screens 4.28.0, RN 0.86.3, iPhone 17 Pro simulator / iOS 26.5. Both were
taken approximately 470 ms after requesting a 300 ms fade push. The readiness
release in the deferred case happens at 650 ms.

| Without deferral                                                 | With deferral                                                                          |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| ![Destination has already appeared](assets/without-deferral.png) | ![Source is still visible while the destination is laid out](assets/with-deferral.png) |

After release, the deferred case completes the same fade. The timeout case emits
one intentional warning. These are correctness checks, not performance results.

Native validation was performed on the 4.28 implementation. The upstream change
moves the same gate to the existing stack's `legacy/` paths on `main`. Older iOS
versions and the new v5 stack are not covered by this scenario. The Android prop
setter is a no-op; this scenario is intentionally listed for iOS only.
