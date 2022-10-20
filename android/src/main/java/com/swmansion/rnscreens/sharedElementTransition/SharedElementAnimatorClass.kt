package com.swmansion.rnscreens.sharedElementTransition

import android.content.Context
import androidx.coordinatorlayout.widget.CoordinatorLayout
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.module.annotations.ReactModule
import com.swmansion.common.SharedElementAnimator
import com.swmansion.common.ScreenStackFragmentCommon
import com.swmansion.common.SharedElementAnimatorDelegate

@ReactModule(name = SharedElementAnimatorClass.MODULE_NAME)
class SharedElementAnimatorClass(reactContext: ReactApplicationContext?)
    : ReactContextBaseJavaModule(reactContext), SharedElementAnimator {

    companion object {
        const val MODULE_NAME = "SharedElementAnimatorClass"
        private var mDelegate: SharedElementAnimatorDelegate = SharedElementAnimatorDelegateMock()

        fun getDelegate(): SharedElementAnimatorDelegate {
            return mDelegate
        }

        fun getTransitionContainer(context: Context) : CoordinatorLayout {
            return mDelegate.getTransitionContainer(context)
        }

        fun getAnimationCoordinatorLayout(
            context: Context,
            fragment: ScreenStackFragmentCommon
        ) : CoordinatorLayout {
            return mDelegate.getAnimationCoordinatorLayout(context, fragment)
        }
    }

    override fun getName(): String {
        return MODULE_NAME
    }

    override fun setDelegate(delegate: SharedElementAnimatorDelegate) {
        // Should be called by Reanimated during native module initialization
        mDelegate = delegate
    }

}