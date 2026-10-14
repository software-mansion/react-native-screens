package com.swmansion.rnscreens.react.containers.stack.animation

import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.swmansion.rnscreens.core.containers.stack.animation.model.PresetName
import com.swmansion.rnscreens.core.containers.stack.animation.model.StackAnimationConfig
import com.swmansion.rnscreens.react.utils.requireNotNullString

/**
 * Converts the React `animation` prop into the package's config. The only file of the package
 * that sees a React Native type; everything below it is framework-neutral.
 *
 * Scalar props are converted inline in the view managers; a discriminated object graph like
 * this one gets a mapper next to its model, as the header toolbar menu does.
 */
internal object StackAnimationMapper {
    internal fun parse(value: Dynamic): StackAnimationConfig =
        when (value.type) {
            ReadableType.String -> StackAnimationConfig.Preset(PresetName.fromString(checkNotNull(value.asString())))
            ReadableType.Map -> parseMap(checkNotNull(value.asMap()))
            else -> throw IllegalArgumentException("[RNScreens] animation must be a preset name or an object.")
        }

    private fun parseMap(map: ReadableMap): StackAnimationConfig =
        when (val type = map.requireNotNullString("type")) {
            "preset" -> StackAnimationConfig.Preset(PresetName.fromString(map.requireNotNullString("name")))
            else -> throw IllegalArgumentException("[RNScreens] Unknown animation type: $type.")
        }
}
