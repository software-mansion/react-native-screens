# Test Scenario: Stack in Tabs - basic navigation scenarios

## Details

**Description:** Test common navigation flows in Stack in Tabs configuration

**OS test creation version:** Android SDK 36, iOS 26.5

## E2E test

TBD: Planned, but will be implemented separately.

## Prerequisites

- iOS or Android device / simulator.

## Steps

### Baseline

1. Launch the app and navigate to the test screen.

- [ ] A tab navigation bar is visible with three destinations: *First*, *Second*, *Stack*.
- [ ] *First* is selected.

---

### Tab navigation

2. Navigate to the *Second* tab.

- [ ] Second tab is selected correctly.

3. Navigate to the *Stack* tab.

- [ ] *First* route there is displayed correctly.

4. Toggle between *First* and *Stack* tabs.

- [ ] Tabs do change "normally", there is no crash.

---

### Nested container state preservation 

1. Navigate to the *Stack* tab.

2. Push *Second* screen.

3. Push *Third* screen.

- [ ] Both *Second* and *Third* are pushed onto the stack.

4. Toggle between *First* and *Stack* tabs.

- [ ] *Stack* tab displays nested stack with *Third* route on top.
