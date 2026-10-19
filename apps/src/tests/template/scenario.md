# Test Scenario: Test case name

> Before writing, read the scenario writing rules:
> `apps/src/tests/template/scenario-rules.md`. Remove this note afterwards.

Example: Test Scenario: colorScheme

## Details

**Description:** Provide a high-level overview of the feature or property being tested. Identify the specific functionality and transitions being validated, while defining the success criteria. Focus on the underlying goal, such as preventing specific UI regressions, visual glitches, or inconsistent behaviors.

**OS test creation version:** Specify the OS version used during the initial implementation of the scenario and screen, for every device family it was written on. This serves as a baseline where the described behavior and visual results were confirmed to work correctly. Example: `iOS 26.5 (iPhone), iPadOS 26.5, Android: API Level 36`.

## E2E test

Full/Incomplete/TBD

- **Full:** The scenario is completely covered by E2E tests.
- **Incomplete:** The scenario is only partially covered or not covered at all.
Include an explanation why.
- **TBD:** The E2E coverage is yet to be determined or implemented. Add relevant
information e.g. research is required, or automation is possible and planned but
not yet implemented.

## Prerequisites

List of devices required to run this test, with the setup each one needs. Must
match `devices` in `scenario-description.ts`.

Example:

- iPhone: simulator or device, iOS 18.6 and 26.5.
- iPhone Duo (only if the test covers Duo): simulator with iOS 27.1+, closed in
  portrait at launch. Postures: closed portrait, open portrait; close and open
  the device with the screen shown.
- Android: emulator or device, API Level 36.

## Note

Include any critical information for scenario execution not covered elsewhere. Use this section to document Known Issues (KI) or specific behaviors that might appear misleading but are considered expected results. Define rules that apply to the entire scenario to avoid repetition in individual steps.

## Steps

Step-by-step instructions for a tester to manually verify the scenario.

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

Optional: add this section only if the test covers iPhone Duo (`duo` in
`devices`) and only for steps whose expected result differs on Duo. Remove it
otherwise.

Run Baseline step 1 from `## Steps` first.
Postures: closed portrait, open portrait; close and open with the screen shown.

### Closed

1. With the device closed in portrait, tap ...

    - [ ] Description of expected behavior in the closed posture.

---

### Unfolding

1. Open the device fully with the screen shown.

    - [ ] Description of expected behavior after unfolding, e.g. the layout
          updates and the state from Closed step 1 is kept.
