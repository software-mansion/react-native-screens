package com.fabricexample

import android.content.res.Configuration
import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "FabricExample"

  override fun onConfigurationChanged(configuration: Configuration) {
    super.onConfigurationChanged(configuration)
    Log.d("SCREENS", "activity id ${this} orientation = ${configuration.orientation}")
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
    super.onCreate(savedInstanceState)

    // Remove this once we have sensible workaround to disable the react callback.
    // Currently it prevents fragment manager's callback from triggering, blocking
    // native-pop & predictive back gesture.
    // See: https://github.com/software-mansion/react-native-screens/pull/3630
    try {
      val field = ReactActivity::class.java.getDeclaredField("mBackPressedCallback")
      field.isAccessible = true
      val callback = field.get(this) as androidx.activity.OnBackPressedCallback
      callback.isEnabled = false // <--- KILL SWITCH
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    // opt out of having 80% opacity over 3-button navigation
    // supported for API level 29 or higher
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
      getWindow().setNavigationBarContrastEnforced(false)
    }
  }
}
