# Test Scenario: Test case name

Example: Test Scenario: colorScheme

## Details

**Description:** Provide a high-level overview of the feature or property being tested. Identify the specific functionality and transitions being validated, while defining the success criteria. Focus on the underlying goal, such as preventing specific UI regressions, visual glitches, or inconsistent behaviors.

**OS test creation version:** Specify the OS version used during the initial implementation of the scenario and screen. This serves as a baseline where the described behavior and visual results were confirmed to work correctly.

## E2E test

Full/Incomplete/TBD

- **Full:** The scenario is completely covered by E2E tests.
- **Incomplete:** The scenario is only partially covered or not covered at all.
Include an explanation why.
- **TBD:** The E2E coverage is yet to be determined or implemented. Add relevant
information e.g. research is required, or automation is possible and planned but
not yet implemented.

## Prerequisites

List of devices or platforms required to run this test.

Example: iOS physical device, Android emulator

## Note (Optional)

Include any critical information for scenario execution not covered elsewhere. Use this section to document Known Issues (KI) or specific behaviors that might appear misleading but are considered expected results. Define rules that apply to the entire scenario to avoid repetition in individual steps.

## Steps

Step-by-step instructions for a tester to manually verify the scenario.

**Format Convention:** Action steps are numbered (e.g., 1. Action). The expected results for that action immediately
follow as Markdown checkboxes (- [ ] Expected result). You can use multiple checkboxes to separate distinct outcomes or
to differentiate between OS/app versions.

You can use subheadings to group steps logically (e.g., ### Baseline) or define separate step
sections for different device or OS types if their execution paths differ significantly (## Steps - iOS or ## Steps - iPad).

1. Navigate to ...

- [ ] Description of expected behavior after the navigation action.

2. Tap ...

- [ ] iOS18: expected behavior on this OS version.
- [ ] iOS26: expected behavior on this OS version.
