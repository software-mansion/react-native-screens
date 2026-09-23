# Test Scenario: Stack Header Bar Minimization (iOS)

## Details

**Description:** Tests header minimization configuration exposed through
the `minimizationBehavior` and `restorationBehavior` header config props. A
single stack screen hosts a long scroll view with both pickers at its top.

**OS test creation version:** 27.0

## E2E test

TBD.

## Prerequisites

- iOS simulator with iOS 27 or higher

## Note

On iOS < 27 the props are ignored and a warning is logged for any value other
than `automatic`.

`restorationBehavior: atScrollEdge` is honored by the system only together with
`minimizationBehavior: onScrollDown`. With other behaviors it falls back to
`automatic`.

On iPhone Duo (currently the only device with iOS 27.1) the system resolves
`minimizationBehavior: automatic` as `onScrollDown`. On every other device,
on iOS 27.0 or 27.2, it resolves as `never`. The steps below assume the
latter.

Whenever the header minimizes or restores, the header items do as well.

## Steps

1. Navigate to **Stack v5 → Stack Header Bar Minimization (iOS)**.

    - [ ] The `minimizationBehavior` picker is set to `automatic`.
    - [ ] The `restorationBehavior` picker is set to `automatic`.
    - [ ] The header has two resizing items on the leading side
        and two on the trailing side.

2. Scroll down, then back up to the top.

    - [ ] The header does NOT minimize during either scroll.
    - [ ] The header items do not minimize either.

3. Set `minimizationBehavior` to `never` and scroll down, then back up.

    - [ ] The header does NOT minimize during either scroll.
    - [ ] The header items do not minimize either.

4. Set `minimizationBehavior` to `onScrollDown` and scroll down to around row 50.

    - [ ] The header minimizes.
    - [ ] The header items minimize as well.

5. Scroll up to around row 30.

    - [ ] The header restores.
    - [ ] The header items restore as well.

6. Scroll to the top and set `restorationBehavior` to `atScrollEdge`. Scroll down to around row 50.

    - [ ] The header minimizes.
    - [ ] The header items minimize as well.

7. Scroll up to around row 30.

    - [ ] The header does NOT restore.
    - [ ] The header items do not restore either.

8. Scroll up to the top.

    - [ ] The header restores.
    - [ ] The header items restore as well.

9. Set `minimizationBehavior` to `onScrollUp` and `restorationBehavior` to `automatic`. Scroll down to around row 50.

    - [ ] The header does NOT minimize.
    - [ ] The header items do not minimize either.

10. Scroll up to around row 30.

    - [ ] The header minimizes.
    - [ ] The header items minimize as well.

11. Scroll up to the top.

    - [ ] The header restores.
    - [ ] The header items restore as well.

12. Set `restorationBehavior` to `atScrollEdge`. Scroll down to around row 50.

    - [ ] The header does NOT minimize.
    - [ ] The header items do not minimize either.

13. Scroll up to around row 30.

    - [ ] The header minimizes.
    - [ ] The header items minimize as well.

14. Scroll up to the top.

    - [ ] The header restores.
    - [ ] The header items restore as well.
