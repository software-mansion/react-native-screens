package com.swmansion.rnscreens

import com.swmansion.common.SharedElementAnimator
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = SharedElementAnimatorClass.MODULE_NAME)
class SharedElementAnimatorClass(reactContext: ReactApplicationContext?)
    : ReactContextBaseJavaModule(reactContext), SharedElementAnimator {

    companion object {
        private var mDelegate: com.swmansion.common.SharedElementAnimatorDelegate? = null

        fun getDelegate(): com.swmansion.common.SharedElementAnimatorDelegate? {
            return mDelegate
        }

        const val MODULE_NAME = "SharedElementAnimatorClass"
    }

    override fun getName(): String {
        return MODULE_NAME
    }

    override fun setDelegate(delegate: com.swmansion.common.SharedElementAnimatorDelegate?) {
        mDelegate = delegate
    }
}