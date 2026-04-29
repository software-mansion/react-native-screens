package com.swmansion.rnscreens.gamma.tabs.container

/**
 * Origin (actor) that requested a tab transition. Mirrors the public `actionOrigin` event field.
 *
 * - [USER] — direct native UI interaction (tab bar tap).
 * - [PROGRAMMATIC_JS] — JS-initiated request delivered via the `navStateRequest` prop.
 * - [PROGRAMMATIC_NATIVE] — request initiated from the native side by a downstream library
 *   integrating directly against [TabsContainer] (not produced by this library itself).
 *
 * The `implicit` origin defined on the public TS API is iOS-only at the moment;
 * Android does not currently produce it.
 */
enum class TabsActionOrigin {
    USER,
    PROGRAMMATIC_JS,
    PROGRAMMATIC_NATIVE,
    ;

    override fun toString(): String =
        when (this) {
            USER -> "user"
            PROGRAMMATIC_JS -> "programmatic-js"
            PROGRAMMATIC_NATIVE -> "programmatic-native"
        }
}
