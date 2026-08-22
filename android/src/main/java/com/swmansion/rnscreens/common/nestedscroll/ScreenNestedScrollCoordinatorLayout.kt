package com.swmansion.rnscreens.common.nestedscroll

import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.view.ViewParent
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.view.ViewCompat
import androidx.core.view.ViewParentCompat

/**
 * CoordinatorLayout that preserves its normal child-behavior dispatch and optionally forwards
 * the remaining nested-scroll transaction to an external screen delegate.
 */
internal abstract class ScreenNestedScrollCoordinatorLayout(
    context: Context,
    private val screen: ViewGroup,
) : CoordinatorLayout(context) {
    private data class AncestorBridge(
        val parent: ViewParent,
        val target: View,
    )

    private var nestedScrollDelegate: ScreenNestedScrollDelegate? = null
    private val superAcceptedTypes = mutableSetOf<Int>()
    private val delegateAcceptedTypes = mutableSetOf<Int>()
    private val delegateTargets = mutableMapOf<Int, View>()
    private val ancestorBridges = mutableMapOf<Int, AncestorBridge>()
    private val delegateConsumed = IntArray(2)
    private val ancestorConsumed = IntArray(2)

    override fun getNestedScrollAxes(): Int = super.getNestedScrollAxes() or (nestedScrollDelegate?.getNestedScrollAxes() ?: 0)

    override fun onStartNestedScroll(
        child: View,
        target: View,
        axes: Int,
        type: Int,
    ): Boolean {
        stopAncestorBridge(type)

        val superAccepted = super.onStartNestedScroll(child, target, axes, type)
        val delegateAccepted =
            isNearestInteropCoordinatorFor(target) &&
                nestedScrollDelegate?.onStartNestedScroll(child, target, axes, type) == true

        if (superAccepted) superAcceptedTypes.add(type) else superAcceptedTypes.remove(type)
        if (delegateAccepted) delegateAcceptedTypes.add(type) else delegateAcceptedTypes.remove(type)

        // If the delegate is the only reason this inner coordinator accepts the source, Android
        // would otherwise stop searching the parent chain here. Preserve the natural parent
        // priority by bridging the original target to the first ancestor that would have accepted
        // it, then let the external delegate see only what remains.
        if (!superAccepted && delegateAccepted) {
            startAncestorBridge(target, axes, type)
        }

        return superAccepted || delegateAccepted
    }

    override fun onNestedScrollAccepted(
        child: View,
        target: View,
        axes: Int,
        type: Int,
    ) {
        if (type in superAcceptedTypes) {
            super.onNestedScrollAccepted(child, target, axes, type)
        }
        if (type in delegateAcceptedTypes) {
            delegateTargets[type] = target
            nestedScrollDelegate?.onNestedScrollAccepted(child, target, axes, type)
        }
    }

    override fun onStopNestedScroll(
        target: View,
        type: Int,
    ) {
        if (type in superAcceptedTypes) {
            super.onStopNestedScroll(target, type)
        }
        stopAncestorBridge(type)
        if (type in delegateAcceptedTypes) {
            nestedScrollDelegate?.onStopNestedScroll(delegateTargets.remove(type) ?: target, type)
        } else {
            delegateTargets.remove(type)
        }
        superAcceptedTypes.remove(type)
        delegateAcceptedTypes.remove(type)
    }

    override fun onNestedPreScroll(
        target: View,
        dx: Int,
        dy: Int,
        consumed: IntArray,
        type: Int,
    ) {
        val consumedBeforeX = consumed[0]
        val consumedBeforeY = consumed[1]

        if (type in superAcceptedTypes) {
            super.onNestedPreScroll(target, dx, dy, consumed, type)
        } else {
            dispatchAncestorPreScroll(dx, dy, consumed, type)
        }

        if (type in delegateAcceptedTypes) {
            val consumedByScreensX = consumed[0] - consumedBeforeX
            val consumedByScreensY = consumed[1] - consumedBeforeY
            val remainingX = dx - consumedByScreensX
            val remainingY = dy - consumedByScreensY
            delegateConsumed.fill(0)

            nestedScrollDelegate?.onNestedPreScroll(
                target,
                remainingX,
                remainingY,
                delegateConsumed,
                type,
            )

            consumed[0] += clampSignedConsumption(remainingX, delegateConsumed[0])
            consumed[1] += clampSignedConsumption(remainingY, delegateConsumed[1])
        }
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
        val consumedBeforeX = consumed[0]
        val consumedBeforeY = consumed[1]

        if (type in superAcceptedTypes) {
            super.onNestedScroll(
                target,
                dxConsumed,
                dyConsumed,
                dxUnconsumed,
                dyUnconsumed,
                type,
                consumed,
            )
        } else {
            dispatchAncestorPostScroll(
                target,
                dxConsumed,
                dyConsumed,
                dxUnconsumed,
                dyUnconsumed,
                consumed,
                type,
            )
        }

        if (type in delegateAcceptedTypes) {
            val consumedByScreensX = consumed[0] - consumedBeforeX
            val consumedByScreensY = consumed[1] - consumedBeforeY
            val remainingX = dxUnconsumed - consumedByScreensX
            val remainingY = dyUnconsumed - consumedByScreensY
            delegateConsumed.fill(0)

            nestedScrollDelegate?.onNestedScroll(
                target,
                dxConsumed,
                dyConsumed,
                remainingX,
                remainingY,
                type,
                delegateConsumed,
            )

            consumed[0] += clampSignedConsumption(remainingX, delegateConsumed[0])
            consumed[1] += clampSignedConsumption(remainingY, delegateConsumed[1])
        }
    }

    override fun onNestedPreFling(
        target: View,
        velocityX: Float,
        velocityY: Float,
    ): Boolean {
        val superConsumed =
            ViewCompat.TYPE_TOUCH in superAcceptedTypes &&
                super.onNestedPreFling(target, velocityX, velocityY)

        if (superConsumed) {
            return true
        }

        val ancestorConsumed =
            ancestorBridges[ViewCompat.TYPE_TOUCH]?.let { bridge ->
                ViewParentCompat.onNestedPreFling(
                    bridge.parent,
                    bridge.target,
                    velocityX,
                    velocityY,
                )
            } == true

        if (ancestorConsumed) {
            return true
        }

        return ViewCompat.TYPE_TOUCH in delegateAcceptedTypes &&
            nestedScrollDelegate?.onNestedPreFling(target, velocityX, velocityY) == true
    }

    override fun onNestedFling(
        target: View,
        velocityX: Float,
        velocityY: Float,
        consumed: Boolean,
    ): Boolean {
        val handledBySuper =
            ViewCompat.TYPE_TOUCH in superAcceptedTypes &&
                super.onNestedFling(target, velocityX, velocityY, consumed)

        if (handledBySuper) {
            return true
        }

        val handledByAncestor =
            ancestorBridges[ViewCompat.TYPE_TOUCH]?.let { bridge ->
                ViewParentCompat.onNestedFling(
                    bridge.parent,
                    bridge.target,
                    velocityX,
                    velocityY,
                    consumed,
                )
            } == true

        if (handledByAncestor) {
            return true
        }

        return ViewCompat.TYPE_TOUCH in delegateAcceptedTypes &&
            nestedScrollDelegate?.onNestedFling(target, velocityX, velocityY, consumed) == true
    }

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        nestedScrollDelegate = ScreenNestedScrollInterop.createDelegate(screen)
        nestedScrollDelegate?.onScreenAttached(screen)
    }

    override fun onDetachedFromWindow() {
        ancestorBridges.keys.toList().forEach(::stopAncestorBridge)
        val delegate = nestedScrollDelegate
        delegateTargets.toList().forEach { (type, target) ->
            delegate?.onStopNestedScroll(target, type)
        }
        delegateTargets.clear()
        delegate?.onScreenDetached(screen)
        nestedScrollDelegate = null
        superAcceptedTypes.clear()
        delegateAcceptedTypes.clear()
        super.onDetachedFromWindow()
    }

    override fun onLayout(
        changed: Boolean,
        left: Int,
        top: Int,
        right: Int,
        bottom: Int,
    ) {
        super.onLayout(changed, left, top, right, bottom)
        nestedScrollDelegate?.onScreenLayout(screen)
    }

    /**
     * Nested navigation can place more than one screen CoordinatorLayout above the same source.
     * Only the closest one may expose the transaction externally, otherwise the same external
     * participant could receive the same source movement more than once. Screens-owned ancestor
     * behavior is preserved separately through [startAncestorBridge].
     */
    private fun isNearestInteropCoordinatorFor(target: View): Boolean {
        var current: View? = target
        while (current != null) {
            if (current is ScreenNestedScrollCoordinatorLayout) {
                return current === this
            }
            current = current.parent as? View
        }
        return false
    }

    /**
     * Replays Android's normal parent search from this coordinator upward while keeping the
     * original nested-scroll target. This path is used only when the external delegate caused an
     * otherwise non-participating inner screen to accept the source.
     */
    private fun startAncestorBridge(
        target: View,
        axes: Int,
        type: Int,
    ) {
        var directChild: View = this
        var candidate = parent

        while (candidate != null) {
            if (ViewParentCompat.onStartNestedScroll(candidate, directChild, target, axes, type)) {
                ancestorBridges[type] = AncestorBridge(candidate, target)
                ViewParentCompat.onNestedScrollAccepted(candidate, directChild, target, axes, type)
                return
            }

            if (candidate is View) {
                directChild = candidate
            }
            candidate = candidate.parent
        }
    }

    private fun stopAncestorBridge(type: Int) {
        val bridge = ancestorBridges.remove(type) ?: return
        ViewParentCompat.onStopNestedScroll(bridge.parent, bridge.target, type)
    }

    private fun dispatchAncestorPreScroll(
        dx: Int,
        dy: Int,
        consumed: IntArray,
        type: Int,
    ) {
        val bridge = ancestorBridges[type] ?: return
        ancestorConsumed.fill(0)
        ViewParentCompat.onNestedPreScroll(
            bridge.parent,
            bridge.target,
            dx,
            dy,
            ancestorConsumed,
            type,
        )
        consumed[0] += clampSignedConsumption(dx, ancestorConsumed[0])
        consumed[1] += clampSignedConsumption(dy, ancestorConsumed[1])
    }

    private fun dispatchAncestorPostScroll(
        target: View,
        dxConsumed: Int,
        dyConsumed: Int,
        dxUnconsumed: Int,
        dyUnconsumed: Int,
        consumed: IntArray,
        type: Int,
    ) {
        val bridge = ancestorBridges[type] ?: return
        ancestorConsumed.fill(0)
        ViewParentCompat.onNestedScroll(
            bridge.parent,
            target,
            dxConsumed,
            dyConsumed,
            dxUnconsumed,
            dyUnconsumed,
            type,
            ancestorConsumed,
        )
        consumed[0] += clampSignedConsumption(dxUnconsumed, ancestorConsumed[0])
        consumed[1] += clampSignedConsumption(dyUnconsumed, ancestorConsumed[1])
    }

    private fun clampSignedConsumption(
        available: Int,
        consumed: Int,
    ): Int =
        when {
            available > 0 -> consumed.coerceIn(0, available)
            available < 0 -> consumed.coerceIn(available, 0)
            else -> 0
        }
}
