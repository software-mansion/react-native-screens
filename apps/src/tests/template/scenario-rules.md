# Scenario writing rules

Rules for writing `scenario.md` files. Start from the template in
[scenario.md](scenario.md) and follow the rules below.

## Details

**OS test creation version:** list every device family the scenario was written
on, e.g. `iOS 26.5 (iPhone), iPadOS 26.5, iOS 27.1 (iPhone Duo), Android: API Level 36`.

## E2E test

E2E coverage is per device: state which devices the E2E test runs on (e.g. iPhone
only, iPad via the `@ipad` suite). iPhone Duo is manual-only for now.

## Prerequisites and `devices`

List the devices required to run the test, with the setup each one needs
(orientation, window size, size class, posture).

The list MUST match the `devices` field in `scenario-description.ts`
(`'iphone' | 'ipad' | 'iphone-duo' | 'android-phone' | 'android-tablet'`). `devices` is
required: list every device this scenario must be run on, and only those. It is
used to group release test runs per device, so a tester can do all iPhone runs,
then all iPad runs, then all Duo runs, without switching back and forth.

Not every test needs iPad or iPhone Duo coverage. Add `ipad` or `iphone-duo` only when
the tested feature looks or behaves differently on that device, or exists only
there (e.g. sidebar on iPad, vertical tab bar on iPhone Duo). Most scenarios run
on iPhone and/or Android phone only.

Example (list only the devices the test actually covers):

- iPhone: simulator or device, iOS 18.6 and 26.5.
- iPad: simulator or device, app in full screen (regular width and height).
- iPhone Duo: simulator with iOS 27.1+, closed in portrait at launch. Postures:
  closed portrait, open portrait; close and open the device with the screen shown.
- Android: emulator or device, API Level 36.

### iPhone Duo posture set

Only for tests that list `iphone-duo` in `devices`.

iPhone Duo has three postures (closed, half-open, open), each in portrait or
landscape, plus transitions between them. Do NOT run every step in every posture.

1. **Pick postures by what changes on screen.** List only the postures where the
   UI looks or behaves differently (e.g. tabs: vertical tab bar when closed,
   bottom tab bar when open in portrait; Stack header: side back button when
   closed, open in landscape).
2. **Always add one transition with the test screen open** (fold or unfold while
   the screen is shown), e.g. closed → open → closed. Most Duo bugs are
   transition bugs.
3. **Extend only when a bug shows it is needed.** When a bug turns up in a
   posture that is not covered yet, add a step for it to the Duo section (or a
   separate Duo test if it needs its own screen).

## Steps

### Conventions

**Format Convention:** Action steps are numbered (e.g., 1. Action). The expected
results for that action immediately follow as Markdown checkboxes
(- [ ] Expected result). You can use multiple checkboxes to separate distinct
outcomes. Use subheadings to group steps logically (e.g., ### Baseline).

**Numbering Convention:** Numbering restarts from 1 in every `###` subsection and
in every `## Steps - <device>` section. Separate subsections with a horizontal
rule (`---`). When referring to another step, always name its section and
subsection, e.g. "Baseline step 2" or "iPhone Duo, Unfolding step 1" - a bare
"step 2" is ambiguous.

**Indentation Convention:** Expected-result checkboxes are indented with
4 spaces (`    - [ ] Expected result`). When a checkbox wraps onto more lines,
align the continuation lines with the checkbox text (10 spaces).

### How to write OS and device differences

Keep one `scenario.md` per test. Do not create per-device files
(`scenario-ipad.md`, `scenario-iphone-duo.md`, ...).

- **OS / platform differences** (iOS 18 vs 26, iOS vs Android) go as prefixed
  checkboxes inside the step, not as separate sections. Write the prefix with a
  space: `iOS 18:`, `iOS 26:`, `Android:`.

  ```text
      - [ ] iOS 18: the tab bar is opaque.
      - [ ] iOS 26: the tab bar uses Liquid Glass.
      - [ ] Android: the tab bar is at the bottom.
  ```

- **Device differences** go into a `## Steps - <device>` section, using exactly
  one of: `## Steps - iPhone`, `## Steps - iPad`, `## Steps - iPhone Duo`,
  `## Steps - Android`. Add a device section **only for steps whose expected
  result differs** on that device. Steps that behave the same everywhere stay in
  the base `## Steps`.
- **Device-only scenarios.** If no step is shared by all listed devices (e.g. a
  test run only on iPad and iPhone Duo), skip the base `## Steps` and write one
  `## Steps - <device>` section per device.
- A device section starts by naming what it builds on and its setup, e.g.
  `Run Baseline steps 1-3 from ## Steps first.` and, for Duo, the posture set:
  `Postures: closed portrait, open portrait; close and open with the screen shown.`

### Where device-specific bugs and tests go

| Case | Example | How to handle it |
| ---- | ------- | ---------------- |
| Generic feature, bug found only on one device | blinking back button on Duo | Add the step that caught the bug to the `## Steps - <device>` section of the **generic** test's `scenario.md`, with the posture/setup where it reproduces. Add the device to that test's `devices`. The issue test (`issue-tests/TestXXXX`) stays only for reproducing and fixing the bug - it has no `scenario-description.ts`, so it does not carry `devices` and is not on the release list. |
| Shared feature that looks or behaves differently on a device | vertical tab bar on Duo, sidebar on iPad | Same `scenario.md`, plus a `## Steps - <device>` section only for the differing steps; posture set / setup in Prerequisites. |
| Device-only feature, same screen works for it | a Duo-only prop | Normal test dir with the platform suffix (`-ios`) and `devices: ['iphone-duo']`; the whole `scenario.md` is the device scenario with its own posture set. |
| Same feature, but the device needs a **different `index.tsx`** (different layout) | a generic `test-tabs-foo-ios` exists, Duo needs its own screen | Create a separate test dir named after the generic one with the device suffix instead of the platform suffix: `test-tabs-foo-duo` (`-ipad` for iPad). `devices` lists only that device. The generic test does not list the device. |
| Native platform bug, not fixable in the library | UIKit layout bug on fold | Record it in `## Note` as a Known issue with a link, not as a failing step. |

### Example

See [scenario.md](scenario.md) for an example of the base `## Steps` and an
optional `## Steps - iPhone Duo` section.
