package com.fabricexample

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
import com.fabricexample.nestedscroll.NestedScrollInteropTestPackage
import com.fabricexample.nestedscroll.NestedScrollInteropTestProbe

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          add(NestedScrollInteropTestPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    NestedScrollInteropTestProbe.install()
    loadReactNative(this)
  }
}
