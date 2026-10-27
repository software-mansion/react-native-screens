package com.swmansion.rnscreens.core.containers.stack.animation.model

/**
 * A preset named in the `animation` prop with the options written next to it. The same value can
 * stand for the whole animation, one transition or one screen's motion; the config wrapping it
 * states which, and [requireAllowedAt] checks the name and its options against that level.
 */
internal data class PresetConfig(
    val name: PresetName,
    val options: PresetOptions = PresetOptions.NONE,
) {
    internal fun requireAllowedAt(level: PresetLevel) {
        require(level in name.levels) {
            "[RNScreens] Animation preset '${name.stringName}' cannot be ${level.position}."
        }
        val allowed = name.optionsAt(level)
        options.present.firstOrNull { it !in allowed }?.let {
            throw IllegalArgumentException(
                "[RNScreens] Option '${it.key}' is not supported by animation preset '${name.stringName}' as ${level.position}.",
            )
        }
    }
}
