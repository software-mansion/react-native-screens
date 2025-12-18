package com.swmansion.rnscreens.gamma.tabs

import android.view.View
import androidx.core.view.AccessibilityDelegateCompat
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat

class TabItemAccessibilityDelegate : AccessibilityDelegateCompat() {
    override fun onInitializeAccessibilityNodeInfo(
        host: View,
        info: AccessibilityNodeInfoCompat,
    ) {
//        super.onInitializeAccessibilityNodeInfo(host, info)
        throw Error("eeadfasdfasdf")
    }
}
