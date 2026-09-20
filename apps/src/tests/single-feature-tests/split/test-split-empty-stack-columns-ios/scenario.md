# Empty split stack columns

Run `TestSplitEmptyStackColumns` from the Split single-feature tests, or render it directly in `apps/App.tsx`.

1. Launch with an empty detail stack and a detached inspector. The list must appear.
2. Select a detail and show its column. The selected detail must appear.
3. Select two more details, then clear details. Every screen must report dismissal, leaving an empty detail stack and the list visible.
4. Repeat selection and clearing. Also use Unmount details to remove the entire stack in one mounting transaction.
5. On an iPhone, show the empty detail column, return to the list, select a detail and show it. Repeat clearing while the split is folded.
6. On iOS 26 or newer, toggle the inspector while empty, populate it, clear it and populate it again. Hide it before returning to the list on an iPhone.
7. Run `TestStackSimpleNav` to check that ordinary stacks still preserve their root and support button, header and gesture pops.

The controls stay outside the split so that an empty visible column cannot hide the actions needed to repopulate it.
