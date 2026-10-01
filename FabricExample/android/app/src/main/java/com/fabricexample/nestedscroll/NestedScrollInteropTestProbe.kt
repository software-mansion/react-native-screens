package com.fabricexample.nestedscroll

import android.view.View
import android.view.ViewGroup
import androidx.core.view.ViewCompat
import com.swmansion.rnscreens.common.nestedscroll.ScreenNestedScrollDelegate
import com.swmansion.rnscreens.common.nestedscroll.ScreenNestedScrollDelegateFactory
import com.swmansion.rnscreens.common.nestedscroll.ScreenNestedScrollInterop

/** Test-only external consumer used by FabricExample to validate the public nested-scroll seam. */
object NestedScrollInteropTestProbe : ScreenNestedScrollDelegateFactory {
    data class Snapshot(
        val sequence: Long,
        val delegatesCreated: Int,
        val attached: Int,
        val detached: Int,
        val layouts: Int,
        val touchStarts: Int,
        val nonTouchStarts: Int,
        val touchStops: Int,
        val nonTouchStops: Int,
        val touchPre: Int,
        val nonTouchPre: Int,
        val touchPost: Int,
        val nonTouchPost: Int,
        val preFlings: Int,
        val flings: Int,
        val delegateConsumedPreY: Long,
        val delegateConsumedPostY: Long,
        val lastScreenClass: String,
        val lastScreenId: Int,
        val lastTargetClass: String,
        val lastTargetId: Int,
        val lastTargetScrollY: Int,
        val lifecycleTrace: List<String>,
    )

    private val lock = Any()

    @Volatile
    private var enabled = false

    @Volatile
    private var consumeRemaining = false

    private var snapshotSequence = 0L
    private var delegatesCreated = 0
    private var attached = 0
    private var detached = 0
    private var layouts = 0
    private var touchStarts = 0
    private var nonTouchStarts = 0
    private var touchStops = 0
    private var nonTouchStops = 0
    private var touchPre = 0
    private var nonTouchPre = 0
    private var touchPost = 0
    private var nonTouchPost = 0
    private var preFlings = 0
    private var flings = 0
    private var delegateConsumedPreY = 0L
    private var delegateConsumedPostY = 0L
    private var lastScreenClass = "none"
    private var lastScreenId = View.NO_ID
    private var lastTargetClass = "none"
    private var lastTargetId = View.NO_ID
    private var lastTargetScrollY = 0
    private val lifecycleTrace = ArrayDeque<String>()

    fun install() = ScreenNestedScrollInterop.installFactory(this)

    fun configure(
        enabled: Boolean,
        consumeRemaining: Boolean,
    ) {
        this.enabled = enabled
        this.consumeRemaining = consumeRemaining
    }

    fun reset() {
        synchronized(lock) {
            delegatesCreated = 0
            attached = 0
            detached = 0
            layouts = 0
            touchStarts = 0
            nonTouchStarts = 0
            touchStops = 0
            nonTouchStops = 0
            touchPre = 0
            nonTouchPre = 0
            touchPost = 0
            nonTouchPost = 0
            preFlings = 0
            flings = 0
            delegateConsumedPreY = 0L
            delegateConsumedPostY = 0L
            lastScreenClass = "none"
            lastScreenId = View.NO_ID
            lastTargetClass = "none"
            lastTargetId = View.NO_ID
            lastTargetScrollY = 0
            lifecycleTrace.clear()
        }
    }

    fun snapshot(): Snapshot =
        synchronized(lock) {
            snapshotSequence += 1
            Snapshot(
                sequence = snapshotSequence,
                delegatesCreated = delegatesCreated,
                attached = attached,
                detached = detached,
                layouts = layouts,
                touchStarts = touchStarts,
                nonTouchStarts = nonTouchStarts,
                touchStops = touchStops,
                nonTouchStops = nonTouchStops,
                touchPre = touchPre,
                nonTouchPre = nonTouchPre,
                touchPost = touchPost,
                nonTouchPost = nonTouchPost,
                preFlings = preFlings,
                flings = flings,
                delegateConsumedPreY = delegateConsumedPreY,
                delegateConsumedPostY = delegateConsumedPostY,
                lastScreenClass = lastScreenClass,
                lastScreenId = lastScreenId,
                lastTargetClass = lastTargetClass,
                lastTargetId = lastTargetId,
                lastTargetScrollY = lastTargetScrollY,
                lifecycleTrace = lifecycleTrace.toList(),
            )
        }

    override fun create(screen: ViewGroup): ScreenNestedScrollDelegate {
        synchronized(lock) {
            delegatesCreated += 1
        }
        return ProbeDelegate(screen)
    }

    private fun rememberScreen(screen: ViewGroup) {
        lastScreenClass = screen.javaClass.name
        lastScreenId = System.identityHashCode(screen)
    }

    private fun rememberTarget(target: View) {
        lastTargetClass = target.javaClass.name
        lastTargetId = System.identityHashCode(target)
        lastTargetScrollY = target.scrollY
    }

    private fun recordLifecycle(event: String) {
        if (lifecycleTrace.size == MAX_TRACE_EVENTS) {
            lifecycleTrace.removeFirst()
        }
        lifecycleTrace.addLast(event)
    }

    private fun typeName(type: Int): String =
        when (type) {
            ViewCompat.TYPE_TOUCH -> "touch"
            ViewCompat.TYPE_NON_TOUCH -> "nonTouch"
            else -> "type-$type"
        }

    private fun incrementByType(
        type: Int,
        touch: () -> Unit,
        nonTouch: () -> Unit,
    ) {
        when (type) {
            ViewCompat.TYPE_TOUCH -> touch()
            ViewCompat.TYPE_NON_TOUCH -> nonTouch()
        }
    }

    private class ProbeDelegate(
        private val screen: ViewGroup,
    ) : ScreenNestedScrollDelegate {
        private val acceptedTypes = mutableSetOf<Int>()
        private val throwawayConsumed = IntArray(2)

        override fun onStartNestedScroll(
            child: View,
            target: View,
            axes: Int,
        ): Boolean = onStartNestedScroll(child, target, axes, ViewCompat.TYPE_TOUCH)

        override fun onNestedScrollAccepted(
            child: View,
            target: View,
            axes: Int,
        ) = onNestedScrollAccepted(child, target, axes, ViewCompat.TYPE_TOUCH)

        override fun onStopNestedScroll(target: View) = onStopNestedScroll(target, ViewCompat.TYPE_TOUCH)

        override fun onNestedScroll(
            target: View,
            dxConsumed: Int,
            dyConsumed: Int,
            dxUnconsumed: Int,
            dyUnconsumed: Int,
        ) {
            throwawayConsumed.fill(0)
            onNestedScroll(
                target,
                dxConsumed,
                dyConsumed,
                dxUnconsumed,
                dyUnconsumed,
                ViewCompat.TYPE_TOUCH,
                throwawayConsumed,
            )
        }

        override fun onNestedPreScroll(
            target: View,
            dx: Int,
            dy: Int,
            consumed: IntArray,
        ) = onNestedPreScroll(target, dx, dy, consumed, ViewCompat.TYPE_TOUCH)

        override fun onNestedFling(
            target: View,
            velocityX: Float,
            velocityY: Float,
            consumed: Boolean,
        ): Boolean {
            synchronized(lock) {
                flings += 1
                rememberScreen(screen)
                rememberTarget(target)
            }
            return false
        }

        override fun onNestedPreFling(
            target: View,
            velocityX: Float,
            velocityY: Float,
        ): Boolean {
            synchronized(lock) {
                preFlings += 1
                rememberScreen(screen)
                rememberTarget(target)
            }
            return false
        }

        override fun getNestedScrollAxes(): Int =
            if (acceptedTypes.isEmpty()) ViewCompat.SCROLL_AXIS_NONE else ViewCompat.SCROLL_AXIS_VERTICAL

        override fun onStartNestedScroll(
            child: View,
            target: View,
            axes: Int,
            type: Int,
        ): Boolean {
            if (!enabled || axes and ViewCompat.SCROLL_AXIS_VERTICAL == 0) {
                acceptedTypes.remove(type)
                return false
            }

            acceptedTypes.add(type)
            synchronized(lock) {
                incrementByType(
                    type,
                    touch = { touchStarts += 1 },
                    nonTouch = { nonTouchStarts += 1 },
                )
                recordLifecycle("start:${typeName(type)}")
                rememberScreen(screen)
                rememberTarget(target)
            }
            return true
        }

        override fun onNestedScrollAccepted(
            child: View,
            target: View,
            axes: Int,
            type: Int,
        ) = Unit

        override fun onStopNestedScroll(
            target: View,
            type: Int,
        ) {
            if (type !in acceptedTypes) return
            synchronized(lock) {
                incrementByType(
                    type,
                    touch = { touchStops += 1 },
                    nonTouch = { nonTouchStops += 1 },
                )
                recordLifecycle("stop:${typeName(type)}")
                rememberScreen(screen)
                rememberTarget(target)
            }
            acceptedTypes.remove(type)
        }

        override fun onNestedPreScroll(
            target: View,
            dx: Int,
            dy: Int,
            consumed: IntArray,
            type: Int,
        ) {
            if (type !in acceptedTypes) return

            val consumedY = if (consumeRemaining) dy else 0
            consumed[1] += consumedY
            synchronized(lock) {
                incrementByType(
                    type,
                    touch = { touchPre += 1 },
                    nonTouch = { nonTouchPre += 1 },
                )
                delegateConsumedPreY += consumedY.toLong()
                rememberScreen(screen)
                rememberTarget(target)
            }
        }

        override fun onNestedScroll(
            target: View,
            dxConsumed: Int,
            dyConsumed: Int,
            dxUnconsumed: Int,
            dyUnconsumed: Int,
            type: Int,
        ) {
            throwawayConsumed.fill(0)
            onNestedScroll(
                target,
                dxConsumed,
                dyConsumed,
                dxUnconsumed,
                dyUnconsumed,
                type,
                throwawayConsumed,
            )
        }

        override fun onNestedScroll(
            target: View,
            dxConsumed: Int,
            dyConsumed: Int,
            dxUnconsumed: Int,
            dyUnconsumed: Int,
            type: Int,
            consumed: IntArray,
        ) {
            if (type !in acceptedTypes) return

            val consumedY = if (consumeRemaining) dyUnconsumed else 0
            consumed[1] += consumedY
            synchronized(lock) {
                incrementByType(
                    type,
                    touch = { touchPost += 1 },
                    nonTouch = { nonTouchPost += 1 },
                )
                delegateConsumedPostY += consumedY.toLong()
                rememberScreen(screen)
                rememberTarget(target)
            }
        }

        override fun onScreenAttached(screen: ViewGroup) {
            synchronized(lock) {
                attached += 1
            }
        }

        override fun onScreenDetached(screen: ViewGroup) {
            synchronized(lock) {
                detached += 1
            }
            acceptedTypes.clear()
        }

        override fun onScreenLayout(screen: ViewGroup) {
            synchronized(lock) {
                layouts += 1
            }
        }
    }

    private const val MAX_TRACE_EVENTS = 32
}
