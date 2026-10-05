package com.swmansion.rnscreens.legacy

import android.graphics.Bitmap
import android.graphics.Rect
import android.graphics.drawable.BitmapDrawable
import android.os.Build
import android.os.Handler
import android.os.HandlerThread
import android.view.PixelCopy
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Pins a screen's currently presented pixels as its foreground drawable right
 * before a dismissing mounting transaction executes, so the exit animation keeps
 * showing the real content after Fabric has deleted the screen's children.
 *
 * This is the Android counterpart of the snapshot iOS takes on dismissal.
 */
internal object ScreenDismissSnapshot {
    // A PixelCopy is a GPU readback of the last presented frame and typically
    // completes within single milliseconds; the deadline only guards against a
    // stalled render pipeline.
    private const val SNAPSHOT_DEADLINE_MS = 64L

    private val snapshotHandler: Handler by lazy {
        Handler(HandlerThread("RNScreensDismissSnapshot").apply { start() }.looper)
    }

    /**
     * Captures the screen's currently presented pixels from the window and sets
     * them as the screen's foreground drawable. The foreground draws above the
     * (soon removed) children, so the exit animation keeps showing the real
     * content. The bitmap dies with the screen view when the fragment view is
     * dropped at the end of the transition.
     *
     * Only call this for screens that a pulled transaction really deletes:
     * nothing clears the foreground on a screen that stays alive.
     */
    fun pinDismissSnapshot(screen: Screen) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            // PixelCopy for a Window source needs API 26.
            return
        }
        if (!screen.isAttachedToWindow || screen.width == 0 || screen.height == 0) {
            return
        }
        if (screen.stackPresentation == Screen.StackPresentation.TRANSPARENT_MODAL) {
            // The window pixels would bake the content behind the transparent
            // screen into the overlay.
            return
        }
        if (screen.container?.topScreen !== screen) {
            // Only the top screen animates out. The window pixels of a covered
            // screen would capture the top screen's content anyway.
            return
        }
        val window = screen.reactContext.currentActivity?.window ?: return

        val location = IntArray(2)
        screen.getLocationInWindow(location)
        val srcRect = Rect(location[0], location[1], location[0] + screen.width, location[1] + screen.height)
        val decorView = window.decorView
        if (!srcRect.intersect(0, 0, decorView.width, decorView.height) ||
            srcRect.width() != screen.width ||
            srcRect.height() != screen.height
        ) {
            // A clipped rect would stretch a partial bitmap over the full view
            // (the foreground fills the view bounds).
            return
        }

        val bitmap =
            try {
                Bitmap.createBitmap(srcRect.width(), srcRect.height(), Bitmap.Config.ARGB_8888)
            } catch (e: OutOfMemoryError) {
                // Skipping the snapshot falls back to the current behavior;
                // crashing a back navigation would be worse than the flash.
                return
            }
        val success = AtomicBoolean(false)
        val latch = CountDownLatch(1)
        try {
            PixelCopy.request(
                window,
                srcRect,
                bitmap,
                { copyResult ->
                    success.set(copyResult == PixelCopy.SUCCESS)
                    latch.countDown()
                },
                snapshotHandler,
            )
            if (!latch.await(SNAPSHOT_DEADLINE_MS, TimeUnit.MILLISECONDS)) {
                return
            }
        } catch (e: IllegalArgumentException) {
            // The window has no backing surface (e.g. mid-teardown).
            return
        } catch (e: InterruptedException) {
            Thread.currentThread().interrupt()
            return
        }

        if (success.get()) {
            screen.foreground = BitmapDrawable(screen.resources, bitmap)
        }
    }
}
