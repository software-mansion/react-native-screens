# Stack Header Menu Presentation (iOS)

Open Actions. Open document and Notifications are disabled and have subtitles.
Delete document is destructive and has a subtitle. Notifications is initially
checked. Disabled taps must emit neither press nor selection callbacks. Delete
increments Presses and keeps the menu presented.

Dismiss the menu. Rename delete using command, then reopen Actions. The renamed
item must retain its subtitle, destructive appearance, and keepsMenuPresented.

Set / omit properties. Both disabled leaves become enabled, subtitles disappear,
and Delete document uses the normal appearance. Open document increments Presses.
Notifications changes only Selections, even though it also defines onPress.
Rename delete using command must preserve the current native toggle state.
Rebuild with the same IDs changes the menu title and restores initial toggle
state, following the existing definition-update lifecycle. The command to turn
notifications off must still work while it is disabled. Rebuilding then restores
the checked initial state while retaining the disabled attribute and subtitle.

Remove / restore menu and repeat. Presentation properties must follow the current
definition, without retaining removed attributes or subtitles. E2E checks cover
callbacks, subtitles, rebuilds, commands, and reset. Check destructive tint visually.
