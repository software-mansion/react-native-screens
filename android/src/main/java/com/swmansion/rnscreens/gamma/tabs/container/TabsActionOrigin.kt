package com.swmansion.rnscreens.gamma.tabs.container

import com.swmansion.rnscreens.gamma.tabs.container.TabsActionOrigin.JS
import com.swmansion.rnscreens.gamma.tabs.container.TabsActionOrigin.USER

/**
 * Origin (actor) that requested a tab transition. Mirrors the public `actionOrigin` event field.
 *
 * - [USER] — direct native UI interaction (tab bar tap).
 * - [JS] — JS-initiated request delivered via the `navStateRequest` prop.
 *
 * The `implicit` origin defined on the public TS API is iOS-only at the moment;
 * Android does not currently produce it.
 */
enum class TabsActionOrigin {
    USER,
    JS,
    ;

    override fun toString(): String =
        when (this) {
            USER -> "user"
            JS -> "js"
        }
}
