package com.swmansion.rnscreens.core.containers.stack.animation.model

internal sealed interface StackAnimationDescriptor {
    data class Preset(
        val name: PresetName,
    ) : StackAnimationDescriptor

    companion object {
        val DEFAULT: StackAnimationDescriptor = Preset(PresetName.DEFAULT)
    }
}
