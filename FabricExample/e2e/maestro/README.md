# Maestro E2E flows

These flows mirror the Detox e2e tests as closely as possible (same `it()` cases and assertions where Maestro supports them). Known mapping notes:

## First test (`first-test.yaml`)

- **Detox:** `toExist()` for root header + all 9 buttons via `root-screen-example-${name}`. App uses `root-screen-playground-*` for the 5 playground items.
- **Maestro:** Same 1 + 9 checks; uses `root-screen-playground-*` + `scrollUntilVisible` for playground buttons to match app IDs.

## Bottom tabs (`bottom-tabs.yaml`)

- **Detox:** 6 cases: main and back, details + `toHaveLabel('More details 1')`, details and back + `toHaveLabel('More details 0')`, between tabs + `toHaveText('A'|'B')`, double-tap tab + `multiTap(2)` + label, keep stack state (no commented tap-back).
- **Maestro:** Same 6 cases; `toHaveLabel`/`toHaveText` → `assertVisible` with `text:`; `multiTap(2)` → `doubleTapOn`; back via `BackButton`.

## Events (`events.yaml`)

- **Detox:** 9 cases: Events exist, opening events (1–2), header back + classical events (iOS 9–16 / Android 9–12), none animation + header back + classical, slide_from_bottom + Chats (3–8), slide_from_bottom + header back + classical, native back + classical, none + native back + classical, slide_from_bottom + native back + classical.
- **Maestro:** Same 9 cases; header back = `BackButton`, native back = `pressKey: back`; event order asserted is iOS (classical 9–16); Android order differs in Detox.

## Native Bottom Tabs (`native-bottom-tabs.yaml`)

- **Detox:** `selectTestScreen('TestBottomTabs')` then 4 its: initially first tab, navigate by tab id, by tab label.
- **Maestro:** Same 4 cases; `selectTestScreen` → scroll to Issue Tests, search, tap TestBottomTabs.

## Simple Native Stack / Stack Presentation

- **Maestro** matches **Detox** step-for-step (same 3 `it()` blocks each).

## Issue tests (test-*.yaml)

- **Detox:** Each file has multiple `it()` cases (e.g. Test432: 4 cases including toggle subviews and modal with back/swipe).
- **Maestro:** test-432 mirrors all 4 cases (BackButton for back, swipe down on `settings-text` for modal dismiss). Other issue flows use the same “open test screen” (search + tap) and as many of the same assertions as practical; some Detox-only checks (e.g. `toBeVisible(100)`, `withAncestor`) have no direct Maestro equivalent and are noted in flow comments where relevant.

## Summary

| Flow                | Alignment with Detox |
|---------------------|----------------------|
| first-test          | Same 1 + 9; app uses playground-* for 5 items |
| simple-native-stack | Same 3 cases         |
| stack-presentation  | Same 3 cases         |
| bottom-tabs         | Same 6 cases         |
| events              | Same 9 cases (iOS event order) |
| native-bottom-tabs  | Same 4 cases         |
| test-432            | Same 4 cases         |
| Other issue tests   | Same open-screen path; assertions aligned where possible |
