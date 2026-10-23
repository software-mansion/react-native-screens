# Scenario writing rules

Rules for writing `scenario.md` files. Start from the template in
[scenario.md](../apps/src/tests/template/scenario.md) and follow the rules below.

## What goes where

`scenario-description.ts` is the only place for the scenario's metadata. Do not
write it by hand in `scenario.md`:

| Information | `scenario-description.ts` field |
| ----------- | ------------------------------- |
| Short description shown in the example app | `details` |
| Platforms | `platforms` |
| Devices the scenario must run on | `devices` |
| OS versions to test on and OS versions the scenario was created on, per device | `osVersions` (`testOn`, `createdOn`) |
| Setup a device needs (orientation, window size, size class, posture set) | `deviceSetup` |
| E2E coverage status | `e2eCoverage` |
| What the E2E test covers and why the rest is not automated | `e2eCoverageDetails` |
| Smoke test | `smokeTest` |

`scenario.md` holds only:

- the title (`# Test Scenario: <name>`),
- the metadata block, generated from `scenario-description.ts`,
- `## Description` - what the scenario validates and why (the regression,
  glitch or behavior it guards against). `details` in
  `scenario-description.ts` is the short in-app text, this is the full one,
- `## Note` - Known Issues (KI) and expected behavior that might not be
  intuitive,
- the steps (`## Steps` and optional `## Steps - <platform>` /
  `## Steps - <device>` sections).

### Metadata block

The block between `<!-- scenario-metadata:start ... -->` and
`<!-- scenario-metadata:end -->` is generated. Do not edit it. After changing
`scenario-description.ts`, run:

```bash
yarn sync-scenario-metadata
```

`yarn sync-scenario-metadata --check` fails when a block is missing or
does not match `scenario-description.ts`, when `scenario.md` has a hand-written
`## Details`, `## E2E test`, `## Prerequisites` or `**OS test creation
version:**`, or when the metadata is inconsistent (e.g. an `osVersions` key not
in `devices`, an iOS device without `'ios'` in `platforms`).

### Example

```ts
export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Item Badge',
  key: 'test-tabs-item-badge',
  details: 'Validates the badgeValue prop on TabsScreen and badge colors.',
  platforms: ['ios', 'android'],
  devices: ['iphone', 'iphone-duo', 'android-phone'],
  osVersions: {
    iphone: { createdOn: ['iOS 26.5'], testOn: ['iOS 18.6', 'iOS 26.5'] },
    'iphone-duo': { createdOn: ['iOS 27.1'], testOn: ['iOS 27.1'] },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  deviceSetup: {
    'iphone-duo':
      'Closed in portrait at launch. Postures: closed portrait, open portrait; close and open with the screen shown.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Only Baseline step 1 is automated on iPhone. Badge colors need screenshot diffs, not implemented yet. iPhone Duo is manual-only.',
  smokeTest: false,
};
```

## `devices`, `osVersions` and `deviceSetup`

`devices` (`'iphone' | 'ipad' | 'iphone-duo' | 'android-phone' |
'android-tablet'`) is required: list every device this scenario must be run on,
and only those. It is used to group release test runs per device, so a tester
can do all iPhone runs, then all iPad runs, then all Duo runs, without switching
back and forth.

`osVersions` has two lists per device. Fill both for every device in `devices`:

- `testOn` - OS versions a tester must run the scenario on (e.g. both iOS 18
  and iOS 26 when the expected results differ between them).
- `createdOn` - OS versions the scenario was written on and confirmed to work.
  It stays in `scenario-description.ts` only and is not shown in `scenario.md`.

The generated table has one row per device in `devices` and no other devices,
with columns Device, Test on (and Setup when any device has
`deviceSetup`).

`deviceSetup` describes what a device needs before the scenario is run. Add it
only for devices that need more than the default (e.g. iPad in full screen,
iPhone Duo posture set).

E2E coverage is per device: state in `e2eCoverageDetails` which devices the E2E
test runs on (e.g. iPhone only, iPad via the `@ipad` suite). iPhone Duo is
manual-only for now.

Not every test needs iPad or iPhone Duo coverage. Add `ipad` or `iphone-duo` only when
the tested feature looks or behaves differently on that device, or exists only
there (e.g. sidebar on iPad, vertical tab bar on iPhone Duo). Most scenarios run
on iPhone and/or Android phone only.

### iPhone Duo posture set

Only for tests that list `iphone-duo` in `devices`. Write the chosen posture
set into `deviceSetup['iphone-duo']`.

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
in every platform and device section. Separate subsections with a horizontal
rule (`---`). When referring to another step, always name its section and
subsection, e.g. "Baseline step 2" or "iPhone Duo, Unfolding step 1" - a bare
"step 2" is ambiguous.

**Indentation Convention:** Expected-result checkboxes must be nested under
their numbered step, and wrapped lines must stay inside their list item,
following the [CommonMark list item rules](https://spec.commonmark.org/current/#list-items).

### How to write OS and device differences

Keep one `scenario.md` per test. Do not create per-device files
(`scenario-ipad.md`, `scenario-iphone-duo.md`, ...).

- **Small OS / platform differences** inside a shared step (iOS 18 vs 26, iOS
  vs Android) go as prefixed checkboxes. Write the prefix with a space:
  `iOS 18:`, `iOS 26:`, `Android:`. When the steps themselves differ per
  platform, use a platform section (see below).

  ```text
      - [ ] iOS 18: the tab bar is opaque.
      - [ ] iOS 26: the tab bar uses Liquid Glass.
      - [ ] Android: the tab bar is at the bottom.
  ```

- **Platform and device sections** use exactly one of these headings:
  - platform: `## Steps - iOS`, `## Steps - Android` - for steps whose
    expected result is shared by every listed device of that platform,
  - device: `## Steps - iPhone`, `## Steps - iPad`, `## Steps - iPhone Duo`,
    `## Steps - Android phone`, `## Steps - Android tablet` - for steps
    whose expected result differs between devices of the same platform.

  Add a section **only for steps whose expected result differs**. Steps that
  behave the same everywhere stay in the base `## Steps`. A step goes into
  either the platform section or the device sections, never both.
- **Device-only scenarios.** If no step is shared by all listed devices (e.g. a
  test run only on iPad and iPhone Duo), skip the base `## Steps` and write one
  `## Steps - <device>` section per device.
- A device section starts by naming what it builds on, e.g.
  `Run Baseline steps 1-3 from ## Steps first.` The device setup (e.g. the Duo
  posture set) goes into `deviceSetup`, not into the section.

### Where device-specific bugs and tests go

| Case | Example | How to handle it |
| ---- | ------- | ---------------- |
| Generic feature, bug found only on one device | blinking back button on Duo | Add the step that caught the bug to the `## Steps - <device>` section of the **generic** test's `scenario.md`, with the posture/setup where it reproduces. Add the device to that test's `devices`. The issue test (`issue-tests/TestXXXX`) stays only for reproducing and fixing the bug - it has no `scenario-description.ts`, so it does not carry `devices` and is not on the release list. |
| Shared feature that looks or behaves differently on a device | vertical tab bar on Duo, sidebar on iPad | Same `scenario.md`, plus a `## Steps - <device>` section only for the differing steps; posture set / setup in `deviceSetup`. |
| Device-only feature, same screen works for it | a Duo-only prop | Normal test dir with the platform suffix (`-ios`) and `devices: ['iphone-duo']`; the whole `scenario.md` is the device scenario with its own posture set. |
| Same feature, but the device needs a **different `index.tsx`** (different layout) | a generic `test-tabs-foo-ios` exists, Duo needs its own screen | Create a separate test dir named after the generic one with the device suffix instead of the platform suffix: `test-tabs-foo-duo` (`-ipad` for iPad). `devices` lists only that device. The generic test does not list the device. |
| Native platform bug, not fixable in the library | UIKit layout bug on fold | Record it in `## Note` as a Known issue with a link, not as a failing step. |

### Steps example

See [scenario.md](../apps/src/tests/template/scenario.md) for an example of the base `## Steps` and an
optional `## Steps - iPhone Duo` section.
