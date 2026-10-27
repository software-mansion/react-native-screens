package com.swmansion.rnscreens.core.containers.stack.animation.model

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
    internal val present: Set<PresetOption>
        get() =
            buildSet {
                if (durationMs != null) add(PresetOption.DURATION)
                if (easing != null) add(PresetOption.EASING)
                if (distance != null) add(PresetOption.DISTANCE)
            }

    companion object {
        internal val NONE = PresetOptions()
    }
}
