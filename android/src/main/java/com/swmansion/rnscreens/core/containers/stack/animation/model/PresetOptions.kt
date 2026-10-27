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
            PresetOption.entries.filterTo(mutableSetOf()) { option ->
                when (option) {
                    PresetOption.DURATION -> durationMs != null
                    PresetOption.EASING -> easing != null
                    PresetOption.DISTANCE -> distance != null
                }
            }

    companion object {
        internal val NONE = PresetOptions()
    }
}
