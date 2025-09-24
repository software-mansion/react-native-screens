package com.swmansion.rnscreens.safearea

/**
 * Allows containers that obscure some part of its children views to provide safe area.
 *
 * This protocol only handles **interface insets** (e.g. toolbar, bottomNavigationView).
 * System insets (e.g. `systemBars`, `displayCutout`) are handled through Android inset
 * dispatch mechanism (via `onApplyWindowInsets`).
 *
 * Classes implementing this protocol are responsible for notifying `SafeAreaView`, which
 * registers as a listener, about changes to **interface** safe area insets.
 */
interface SafeAreaProvider {
    /**
     * Responsible for registering **interface** safe area insets listener.
     *
     * @param listener `SafeAreaView` instance that wants to receive notifications
     * about changes to **interface** safe area insets via `onInterfaceInsetsChange`.
     */
    fun setOnInterfaceInsetsChangeListener(listener: SafeAreaView)

    /**
     * Responsible for unregistering **interface** safe area insets listener.
     *
     * @param listener `SafeAreaView` instance that wants to stop receiving notifications
     * about changes to **interface** safe area insets.
     */
    fun removeOnInterfaceInsetsChangeListener(listener: SafeAreaView)

    /**
     * Responsible for providing current **interface** safe area insets.
     *
     * @returns `EdgeInsets` describing the current **interface** safe area insets.
     */
    fun getInterfaceInsets(): EdgeInsets
}
