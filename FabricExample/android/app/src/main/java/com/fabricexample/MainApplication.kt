package com.fabricexample

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.internal.featureflags.ReactNativeFeatureFlags
import com.facebook.react.internal.featureflags.ReactNativeNewArchitectureFeatureFlagsDefaults
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.react.views.view.setEdgeToEdgeFeatureFlagOn
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNativeWithoutPreparedTextLayout()
  }

  /**
   * Same as the generated `ReactNativeApplicationEntryPoint.loadReactNative(this)`, except
   * `enablePreparedTextLayout` is turned off.
   *
   * RN 0.89 enables it by default, which mounts `<Text>` as `PreparedLayoutTextView`, a
   * `ViewGroup` rather than a `TextView`. Detox finds text only through `TextView`, so
   * `by.text`, `by.label`, `toHaveText` and `getAttributes().text` stop matching and the
   * Android e2e suite fails wholesale. Feature flags can be overridden only once, which
   * `DefaultNewArchitectureEntryPoint.load()` already does, so its body is inlined here
   * with the STABLE flag set (`ReactNativeNewArchitectureFeatureFlagsDefaults`) instead.
   * Remove once Detox supports `PreparedLayoutTextView`.
   */
  private fun loadReactNativeWithoutPreparedTextLayout() {
    SoLoader.init(this, OpenSourceMergedSoMapping)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      ReactNativeFeatureFlags.override(
        object : ReactNativeNewArchitectureFeatureFlagsDefaults() {
          override fun enablePreparedTextLayout(): Boolean = false
        }
      )
      SoLoader.loadLibrary("react_newarchdefaults")
      SoLoader.loadLibrary("appmodules")
    }
    if (BuildConfig.IS_EDGE_TO_EDGE_ENABLED) {
      setEdgeToEdgeFeatureFlagOn()
    }
  }
}
