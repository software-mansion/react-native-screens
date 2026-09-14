package com.swmansion.rnscreens.stack.animation

import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.JSApplicationIllegalArgumentException
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.swmansion.rnscreens.helpers.requireNotNullString
import com.swmansion.rnscreens.stack.animation.model.PresetName
import com.swmansion.rnscreens.stack.animation.model.StackAnimationDescriptor

/**
 * Parses the React `animation` prop (Dynamic) into the native descriptor.
 */
internal object StackAnimationMapper {
    fun parse(value: Dynamic): StackAnimationDescriptor =
        when (value.type) {
            ReadableType.String -> StackAnimationDescriptor.Preset(PresetName.fromJs(checkNotNull(value.asString())))
            ReadableType.Map -> parsePackage(checkNotNull(value.asMap()))
            else -> throw JSApplicationIllegalArgumentException("[RNScreens] animation must be a preset name or an object.")
        }

    private fun parsePackage(map: ReadableMap): StackAnimationDescriptor =
        when (val type = map.requireNotNullString("type")) {
            "preset" -> StackAnimationDescriptor.Preset(PresetName.fromJs(map.requireNotNullString("name")))
            else -> throw JSApplicationIllegalArgumentException("[RNScreens] Unknown animation type: $type.")
        }
}
