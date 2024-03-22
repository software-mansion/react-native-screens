package com.swmansion.rnscreens

import com.facebook.react.uimanager.LayoutShadowNode
import com.facebook.yoga.YogaDisplay

class ScreenShadowNode : LayoutShadowNode() {
    override fun setDisplay(display: String?) {}
    override fun setDisplay(display: YogaDisplay?) {}
}
