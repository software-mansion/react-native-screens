package com.swmansion.rnscreens.safearea

import androidx.core.graphics.Insets

interface SafeAreaProvider {
    fun setOnInterfaceInsetsChangeListener(listener: SafeAreaView)
    fun removeOnInterfaceInsetsChangeListener(listener: SafeAreaView)
    fun getSafeAreaInsets(): Insets
}