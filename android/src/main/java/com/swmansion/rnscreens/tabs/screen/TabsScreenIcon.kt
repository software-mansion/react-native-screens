package com.swmansion.rnscreens.tabs.screen

import android.content.Context
import android.graphics.drawable.Drawable
import com.swmansion.rnscreens.helpers.IconResolution
import com.swmansion.rnscreens.helpers.NoTintDrawable
import com.swmansion.rnscreens.helpers.PropIconResolver
import kotlin.properties.Delegates

/**
 * Single icon slot (normal or selected) of a tab bar item. Props stage here and may arrive
 * in any order within a single update batch; resolution runs once per transaction via
 * [resolveIfNeeded]. [onChanged] fires only when the resolved [drawable] actually changes.
 */
internal class TabsScreenIcon(
    private val context: Context,
    private val onChanged: () -> Unit,
) {
    var drawableResourceName: String? by Delegates.observable(null) { _, oldValue, newValue ->
        if (newValue != oldValue) isInvalidated = true
    }

    var tinted: Boolean by Delegates.observable(true) { _, oldValue, newValue ->
        if (newValue != oldValue) isInvalidated = true
    }

    var imageUri: String? by Delegates.observable(null) { _, oldValue, newValue ->
        if (newValue != oldValue) isInvalidated = true
    }

    // Resolved output; read by the appearance applicator.
    var drawable: Drawable? = null
        private set

    private var isInvalidated = false

    // Handles source precedence (drawable name wins over uri), dedup, and stale async image drops.
    private val resolver = PropIconResolver()

    // Kept unwrapped so a tint-only change re-wraps without reloading.
    private var rawDrawable: Drawable? = null
    private var appliedTinted = true

    fun resolveIfNeeded() {
        if (!isInvalidated) {
            return
        }
        isInvalidated = false
        resolver.resolve(context, drawableResourceName, imageUri) { result ->
            when (result) {
                IconResolution.Unchanged -> if (tinted != appliedTinted) emit()
                is IconResolution.Resolved -> {
                    rawDrawable = result.drawable
                    emit()
                }
            }
        }
    }

    // Tint is read at emit time, so a toggle during an in-flight image load still applies.
    private fun emit() {
        appliedTinted = tinted
        val next = rawDrawable?.let { if (tinted) it else NoTintDrawable(it) }
        if (next !== drawable) {
            drawable = next
            onChanged()
        }
    }
}
