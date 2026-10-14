package com.swmansion.rnscreens.core.containers.stack.animation.model

/**
 * The options a preset may accept in the object form of the `animation` prop.
 */
internal enum class PresetOption(
    internal val key: String,
) {
    DURATION("duration"),
    EASING("easing"),
    DISTANCE("distance"),
}

/**
 * Options applied while a preset's tables are built: [durationMs] replaces the reference
 * duration, [easing] the curve of every track, [distance] the travel of the moving screen.
 */
internal data class PresetOptions(
    val durationMs: Long? = null,
    val easing: Easing? = null,
    val distance: Length? = null,
) {
    companion object {
        internal val NONE = PresetOptions()
    }
}
