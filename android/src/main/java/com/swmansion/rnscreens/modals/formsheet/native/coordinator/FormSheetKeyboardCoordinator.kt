package com.swmansion.rnscreens.modals.formsheet.native.coordinator

import android.widget.FrameLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsAnimationCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.doOnLayout

internal class FormSheetKeyboardCoordinator(
    private val bottomSheetView: FrameLayout,
) {
    /**
     * Whether the sheet should track the keyboard animation. Kept `false` while an enter / exit
     * transition owns `translationY`. Tracking the keyboard (`true`) should be allowed only when
     * the sheet is in PRESENTED state.
     */
    internal var isTrackingEnabled: Boolean = false

    private val insetsAnimationCallback = KeyboardInsetsAnimationCallback()

    internal fun setup() {
        // BottomSheetBehavior registers an internal `WindowInsetsAnimationCallback` on the
        // sheet view during its first `onLayoutChild`. That callback drives `translationY` to track
        // animated inset changes, what interferes with our slide-in custom animation.
        //
        // We manage insets ourselves by setting a fixed height for FormSheetContainer, so we can
        // clear the Material's callback to remove the conflict entirely.
        //
        // This method must run after the first layout pass.
        bottomSheetView.doOnLayout {
            ViewCompat.setWindowInsetsAnimationCallback(it, insetsAnimationCallback)
        }
    }

    internal fun destroy() {
        ViewCompat.setWindowInsetsAnimationCallback(bottomSheetView, null)
    }

    private inner class KeyboardInsetsAnimationCallback : WindowInsetsAnimationCompat.Callback(DISPATCH_MODE_STOP) {
        private var startTop = 0
        private var startTranslationY = 0f

        // Decided once per keyboard animation, in `onPrepare`. Tracking can't be picked up mid-animation
        // because of no start position to translate from.
        private var isTracking = false

        private val isActive: Boolean
            get() = isTracking && isTrackingEnabled

        override fun onPrepare(animation: WindowInsetsAnimationCompat) {
            if (!animation.isKeyboardAnimation() || !isTrackingEnabled) {
                return
            }

            // Saving sheet's position before applying keyboard insets.
            startTop = bottomSheetView.top
            isTracking = true
        }

        override fun onStart(
            animation: WindowInsetsAnimationCompat,
            bounds: WindowInsetsAnimationCompat.BoundsCompat,
        ): WindowInsetsAnimationCompat.BoundsCompat {
            if (!animation.isKeyboardAnimation() || !isActive) {
                return bounds
            }

            // The end sheet position is known - move the sheet and let the animation progress
            // bring it to the new position.
            startTranslationY = (startTop - bottomSheetView.top).toFloat()
            bottomSheetView.translationY = startTranslationY
            return bounds
        }

        override fun onProgress(
            insets: WindowInsetsCompat,
            runningAnimations: List<WindowInsetsAnimationCompat>,
        ): WindowInsetsCompat {
            if (!isActive) {
                return insets
            }

            val keyboardAnimation = runningAnimations.firstOrNull { it.isKeyboardAnimation() } ?: return insets
            bottomSheetView.translationY = startTranslationY * (1f - keyboardAnimation.interpolatedFraction)
            return insets
        }

        override fun onEnd(animation: WindowInsetsAnimationCompat) {
            if (!animation.isKeyboardAnimation()) {
                return
            }

            if (isActive) {
                bottomSheetView.translationY = 0f
            }
            isTracking = false
        }

        private fun WindowInsetsAnimationCompat.isKeyboardAnimation(): Boolean = typeMask and WindowInsetsCompat.Type.ime() != 0
    }
}
