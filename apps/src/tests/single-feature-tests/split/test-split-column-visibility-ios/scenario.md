# Split column visibility, iOS

Run this scenario as a top-level FabricExample screen. Use an iPad with a regular horizontal size class, then an iPhone or a compact window.

Replace `apps/App.tsx` temporarily with this complete entry point:

```tsx
export { default } from './src/tests/single-feature-tests/split/test-split-column-visibility-ios';
```

The scenario is registered in the Split group. Native Split nesting is still under development, so the existing native-stack selection harness can show an empty split; use the top-level entry for this test.

## Native visibility commands

1. Start with both columns visible. Tap **Hide primary** in the secondary column, then **Show primary**.
   - The primary column hides and returns with UIKit's native transition.
   - The secondary column stays interactive.
   - Each display-mode change emits one event. The JS preference remains `oneBesideSecondary`; the event handler only records the result.
2. Tap **Rapid hide/show**. It issues `show('primary')` 100 ms after `hide('primary')`. Repeat it several times.
   - The final layout follows the last command, without an extra transition or event loop.
3. Hide the primary column, then tap **Toggle color scheme**.
   - The primary column remains hidden. An unrelated appearance update must not reapply the display-mode preference.
4. Use the native display-mode button or a sidebar gesture. Toggle the color scheme again.
   - The native interaction is preserved. The event handler must not feed the actual mode back into the preference.

## Property behavior

5. Tap **Prefer secondary only**, then **Prefer both columns**.
   - Property updates keep their existing immediate behavior, matching a native `preferredDisplayMode` assignment outside an animation block.
6. Tap **Prefer automatic**, then use the native hide/show commands.
   - UIKit chooses the display mode and native transitions even when the preference is automatic.
7. Tap **Prefer secondary only**, then **Remove preference**.
   - Removing the prop resets the native preference to automatic. **Remove preference** while it is already unset does not produce an extra event.
8. Tap **Remount split** with both columns preferred, then with automatic or unset preference.
   - Initial configuration is applied without an added sidebar animation.

## Adaptation and accessibility

9. Repeat in a compact window or on an iPhone. Use the native back button and show/hide commands.
   - UIKit owns the compact column navigation. No expanded-sidebar animation is layered onto a collapse or expansion.
   - `hide('primary')` is a no-op while collapsed, matching UIKit. **Show secondary** in the primary column uses the existing `show('secondary')` command.
10. Enable **Settings > Accessibility > Motion > Reduce Motion**, relaunch, and repeat hide/show.
    - The transition matches native UISplitViewController behavior with Reduce Motion, including any native crossfade.

The separate command-show-column scenario exercises a triple-column split. Test `hide('supplementary')` in a triple-column split alongside `show('supplementary')`; hiding the secondary column is intentionally excluded from the public type because UIKit does not support it.
