package com.swmansion.rnscreens.gamma.stack.header.toolbar

/**
 * Defaults for toolbar menu item fields.
 *
 * Must stay in sync with the codegen spec in
 * `src/fabric/gamma/stack/StackHeaderConfigAndroidNativeComponent.ts`
 * (`ToolbarMenuItemAndroid`). Codegen does not fill nested-object defaults,
 * so the native side is the source of truth for them.
 */
internal object StackHeaderToolbarMenuItemDefaults {
    const val TITLE: String = ""
    const val HIDDEN: Boolean = false
}
