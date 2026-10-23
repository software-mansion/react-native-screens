# Stack Header Menu Action State (iOS)

Open Format. Bold is an automatic action with on state, Italic is an explicit
action with mixed state. Notifications is an unchecked native toggle even though
its definition has state on. Alignment contains automatic native radio items:
Trailing is initially checked; their state properties are ignored.

Tap Bold and reopen. It increments Presses without changing its application state
or emitting selection callbacks. Notifications and Alignment change Selections
without firing onPress. Cycle Bold state through mixed, off, and on. The indicators
must follow the definition. Omit action states to reset both actions to off.

Command Bold mixed, then rename it. The title command must preserve mixed state.
Reset Bold using command passes explicit undefined and must clear the indicator.
The Notifications command must follow toggleState, ignoring state off. Definition
rebuilds restore application action state and the existing initial native toggle
state. Remove / restore menu and repeat. Check the system's mixed-state indicator
visually alongside the native E2E callback, command, reset, and lifecycle checks.
