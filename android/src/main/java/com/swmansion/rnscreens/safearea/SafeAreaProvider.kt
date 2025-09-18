package com.swmansion.rnscreens.safearea

interface SafeAreaProvider {
    fun setOnInterfaceInsetsChangeListener(listener: SafeAreaView)

    fun removeOnInterfaceInsetsChangeListener(listener: SafeAreaView)

    fun getInterfaceInsets(): EdgeInsets
}
