# Stack root replacement (Android)

The raw host starts with one screen, like a cold deep link. Replace top must
replace that screen without crashing or creating a back-stack entry. Repeat,
push a detail, and pop: the latest root must be restored, never an old root.
Replace entire history must also work after pushing two details. A non-root
replacement must preserve the root underneath it.

The Detox scenario covers JS-driven updates. For native Back, launch this
scenario directly from FabricExample/App.tsx (the example menu nests stacks):
replace the root, push a detail, use the toolbar Back button, then repeat with
system Back and predictive Back (both cancelled and completed gestures). The
current root must remain after each completed pop; cancelling a gesture keeps
the detail. Back on the root must leave the host rather than reveal old roots.
Repeat with animations enabled and disabled, and after background/foreground.

A removal of the sole root without any pending push remains invalid and must
still fail with “Attempt to pop last screen from the stack”. This scenario does
not expose an invalid operation as an ordinary navigation control.
