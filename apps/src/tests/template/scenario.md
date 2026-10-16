# Test Scenario: Test case name

Example: Test Scenario: colorScheme

## Details

**Description:** Provide a high-level overview of the feature or property being tested. Identify the specific functionality and transitions being validated, while defining the success criteria. Focus on the underlying goal, such as preventing specific UI regressions, visual glitches, or inconsistent behaviors.

**OS test creation version:** Specify the OS version used during the initial implementation of the scenario and screen. This serves as a baseline where the described behavior and visual results were confirmed to work correctly. List every device family the scenario was written on, e.g. `iOS 26.5 (iPhone), iPadOS 26.5, iOS 27.1 (iPhone Duo), Android API 36`.

## E2E test

Full/Incomplete/TBD

- **Full:** The scenario is completely covered by E2E tests.
- **Incomplete:** The scenario is only partially covered or not covered at all.
Include an explanation why.
- **TBD:** The E2E coverage is yet to be determined or implemented. Add relevant
information e.g. research is required, or automation is possible and planned but
not yet implemented.

E2E coverage is per device: state which devices the E2E test runs on (e.g. iPhone
only, iPad via the `@ipad` suite). iPhone Duo is manual-only for now.

## Prerequisites

List of devices or platforms required to run this test, with the setup each one
needs (orientation, window size, size class, posture).

The list MUST match the `devices` field in `scenario-description.ts`
(`'iphone' | 'ipad' | 'duo' | 'android-phone' | 'android-tablet'`). `devices` is
required: list every device this scenario must be run on, and only those. It is
used to group release test runs per device, so a tester can do all iPhone runs,
then all iPad runs, then all Duo runs, without switching back and forth.

Example:

- iPhone: simulator or device, iOS 18.6 and 26.5.
- iPad: simulator or device, app in full screen (regular width and height).
- iPhone Duo: simulator with iOS 27.1+, closed in portrait at launch. Postures:
  closed portrait, open portrait; close and open the device with the screen shown.
- Android: emulator or device, API 36.

### iPhone Duo posture set

iPhone Duo has three postures (closed, half-open, open), each in portrait or
landscape, plus transitions between them. Do NOT run every step in every posture.
Write postures out in full (e.g. "closed, portrait", "half-open",
"open, landscape"); do not use abbreviations.

Rules:

1. **Pick postures by what changes on screen.** List only the postures where the
   UI looks or behaves differently (e.g. tabs: vertical tab bar when closed,
   bottom tab bar when open in portrait; Stack header: side back button when
   closed, open in landscape).
2. **Always add one transition with the test screen open** (fold or unfold while
   the screen is shown), e.g. closed → open → closed. Most Duo bugs are
   transition bugs.
3. **Write the set in Prerequisites.** The tester runs exactly that set, nothing
   more, so "passed on Duo" means the same thing for every tester.
4. **Grow the set only from issues.** Add a posture when a bug shows it matters,
   and link the issue next to it, e.g. "open, landscape (#1234)".

## Note

Include any critical information for scenario execution not covered elsewhere. Use this section to document Known Issues (KI) or specific behaviors that might appear misleading but are considered expected results. Define rules that apply to the entire scenario to avoid repetition in individual steps.

**Known issues:** native platform (e.g. UIKit) bugs that the library cannot fix
are recorded here with a link (issue, Feedback Assistant / Apple report), not as
failing steps. Name the device/posture/OS where it reproduces, e.g.:

- **Known issue (iPhone Duo, open, landscape):** after rotating with a minimized
  tab bar the accessory stops short of the tab bar. Native UIKit bug, reported to
  Apple (link).

## Steps

Step-by-step instructions for a tester to manually verify the scenario.

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
(`scenario-ipad.md`, `scenario-duo.md`, ...).

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
- **Avoid jumping around the file.** If a device shares only the first few steps
  and then diverges, or the tester would have to alternate between the base steps
  and the device section more than once, keep only the shared initial steps in
  `## Steps` and write the rest out in full inside the device section. Each
  section must be executable top to bottom without going back.
- A device section starts by naming what it builds on and its setup, e.g.
  `Run Baseline steps 1-3 from ## Steps first.` and, for Duo, the posture set:
  `Postures: closed portrait, open portrait; close and open with the screen shown.`

### Where device-specific bugs and tests go

| Case | Example | How to handle it |
| ---- | ------- | ---------------- |
| Generic feature, bug found only on one device | blinking back button on Duo | Add the step that caught the bug to the `## Steps - <device>` section of the **generic** test's `scenario.md`, with the posture/setup where it reproduces and a link to the issue. Add the device to that test's `devices`. The issue test (`issue-tests/TestXXXX`) stays only for reproducing and fixing the bug - it has no `scenario-description.ts`, so it does not carry `devices` and is not on the release list. |
| Shared feature that looks or behaves differently on a device | vertical tab bar on Duo, sidebar on iPad | Same `scenario.md`, plus a `## Steps - <device>` section only for the differing steps; posture set / setup in Prerequisites. |
| Device-only feature, same screen works for it | a Duo-only prop | Normal test dir with the platform suffix (`-ios`) and `devices: ['duo']`; the whole `scenario.md` is the device scenario with its own posture set. |
| Same feature, but the device needs a **different `index.tsx`** (different layout) | a generic `test-tabs-foo-ios` exists, Duo needs its own screen | Create a separate test dir named after the generic one with the device suffix instead of the platform suffix: `test-tabs-foo-duo` (`-ipad` for iPad). `devices` lists only that device. The generic test does not list the device. |
| Native platform bug, not fixable in the library | UIKit layout bug on fold | Record it in `## Note` as a Known issue with a link, not as a failing step. |

### Example

```markdown
## Steps

### Baseline

1. Navigate to ...

    - [ ] Description of expected behavior after the navigation action.

---

### Subsection name

1. Tap ...

    - [ ] iOS 18: expected behavior on this OS version.
    - [ ] iOS 26: expected behavior on this OS version.

2. Tap ...

    - [ ] Description of expected behavior after the action, wrapped onto
          a second line.

## Steps - iPhone Duo

Run Baseline step 1 from `## Steps` first.
Postures: closed portrait, open portrait; close and open with the screen shown.

### Closed

1. With the device closed in portrait, tap ...

    - [ ] The tab bar is shown as a vertical rail on the side.

---

### Unfolding

1. Open the device fully with the screen shown.

    - [ ] The tab bar moves to the bottom; the selected tab is the same as in
          Closed step 1.
```
