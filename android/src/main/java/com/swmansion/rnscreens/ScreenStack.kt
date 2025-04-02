package com.swmansion.rnscreens

import android.content.Context
import android.graphics.Canvas
import android.os.Build
import android.view.View
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.swmansion.rnscreens.Screen.StackAnimation
import com.swmansion.rnscreens.bottomsheet.requiresEnterTransitionPostponing
import com.swmansion.rnscreens.events.StackFinishTransitioningEvent
import com.swmansion.rnscreens.stack.views.ChildrenDrawingOrderStrategy
import com.swmansion.rnscreens.stack.views.ReverseFromIndex
import com.swmansion.rnscreens.stack.views.ReverseOrder
import com.swmansion.rnscreens.stack.views.ScreensCoordinatorLayout
import com.swmansion.rnscreens.utils.setTweenAnimations
import kotlin.collections.ArrayList
import kotlin.math.max

class ScreenStack(
    context: Context?,
) : ScreenContainer(context) {
    private val stack = ArrayList<ScreenStackFragmentWrapper>()
    private val dismissedWrappers: MutableSet<ScreenStackFragmentWrapper> = HashSet()
    private val drawingOpPool: MutableList<DrawingOp> = ArrayList()
    private var drawingOps: MutableList<DrawingOp> = ArrayList()
    private var topScreenWrapper: ScreenStackFragmentWrapper? = null
    private var removalTransitionStarted = false

    private var childrenDrawingOrderStrategy: ChildrenDrawingOrderStrategy? = null
    private var disappearingTransitioningChildren: MutableList<View> = ArrayList()

    var goingForward = false

    /**
     * Marks given fragment as to-be-dismissed and performs updates on container
     *
     * @param fragmentWrapper to-be-dismissed wrapper
     */
    fun dismiss(screenFragment: ScreenStackFragmentWrapper) {
        dismissedWrappers.add(screenFragment)
        performUpdatesNow()
    }

    override val topScreen: Screen?
        get() = topScreenWrapper?.screen

    val fragments: ArrayList<ScreenStackFragmentWrapper>
        get() = stack

    val rootScreen: Screen
        get() =
            screenWrappers.firstOrNull { !dismissedWrappers.contains(it) }?.screen
                ?: throw IllegalStateException("[RNScreens] Stack has no root screen set")

    override fun adapt(screen: Screen): ScreenStackFragmentWrapper =
        when (screen.stackPresentation) {
            Screen.StackPresentation.FORM_SHEET -> ScreenStackFragment(screen)
            else -> ScreenStackFragment(screen)
        }

    override fun startViewTransition(view: View) {
        check(view is ScreensCoordinatorLayout) { "[RNScreens] Unexpected type of ScreenStack direct subview ${view.javaClass}" }
        super.startViewTransition(view)
        if (view.fragment.isRemoving) {
            disappearingTransitioningChildren.add(view)
        }
        if (disappearingTransitioningChildren.isNotEmpty()) {
            childrenDrawingOrderStrategy?.enable()
        }
        removalTransitionStarted = true
    }

    override fun endViewTransition(view: View) {
        super.endViewTransition(view)

        disappearingTransitioningChildren.remove(view)

        if (disappearingTransitioningChildren.isEmpty()) {
            childrenDrawingOrderStrategy?.disable()
        }
        if (removalTransitionStarted) {
            removalTransitionStarted = false
            dispatchOnFinishTransitioning()
        }
    }

    fun onViewAppearTransitionEnd() {
        if (!removalTransitionStarted) {
            dispatchOnFinishTransitioning()
        }
    }

    private fun dispatchOnFinishTransitioning() {
        val surfaceId = UIManagerHelper.getSurfaceId(this)
        UIManagerHelper
            .getEventDispatcherForReactTag((context as ReactContext), id)
            ?.dispatchEvent(StackFinishTransitioningEvent(surfaceId, id))
    }

    override fun removeScreenAt(index: Int) {
        dismissedWrappers.remove(getScreenFragmentWrapperAt(index))
        super.removeScreenAt(index)
    }

    override fun removeAllScreens() {
        dismissedWrappers.clear()
        super.removeAllScreens()
    }

    override fun hasScreen(screenFragmentWrapper: ScreenFragmentWrapper?): Boolean =
        super.hasScreen(screenFragmentWrapper) && !dismissedWrappers.contains(screenFragmentWrapper)

    override fun onUpdate() {
        // When going back from a nested stack with a single screen on it, we may hit an edge case
        // when all screens are dismissed and no screen is to be displayed on top. We need to gracefully
        // handle the case of newTop being NULL, which happens in several places below
        var newTop: ScreenFragmentWrapper? = null // newTop is nullable, see the above comment ^

        // this is only set if newTop has one of transparent presentation modes
        var visibleBottom: ScreenFragmentWrapper? = null

        // reset, to not use previously set strategy by mistake
        childrenDrawingOrderStrategy = null

        // Determine new first & last visible screens.
        val notDismissedWrappers =
            screenWrappers
                .asReversed()
                .asSequence()
                .filter {
                    !dismissedWrappers.contains(it) &&
                        it.screen.activityState !== Screen.ActivityState.INACTIVE
                }

        newTop = notDismissedWrappers.firstOrNull()
        visibleBottom =
            notDismissedWrappers
                .dropWhile { it.isTranslucent() }
                .firstOrNull()
                ?.takeUnless { it === newTop }

        var shouldUseOpenAnimation = true
        var stackAnimation: StackAnimation? = null

        val newTopAlreadyInStack = stack.contains(newTop)
        val topScreenWillChange = newTop !== topScreenWrapper

        if (newTop != null && !newTopAlreadyInStack) {
            // if new top screen wasn't on stack we do "open animation" so long it is not the very first
            // screen on stack
            if (topScreenWrapper != null) {
                // there was some other screen attached before
                // if the previous top screen does not exist anymore and the new top was not on the stack
                // before, probably replace or reset was called, so we play the "close animation".
                // Otherwise it's open animation
                val previousTopScreenRemainsInStack =
                    topScreenWrapper?.let { screenWrappers.contains(it) } == true
                val isPushReplace = newTop.screen.replaceAnimation === Screen.ReplaceAnimation.PUSH
                shouldUseOpenAnimation = previousTopScreenRemainsInStack || isPushReplace
                // if the replace animation is `push`, the new top screen provides the animation, otherwise the previous one
                stackAnimation =
                    if (shouldUseOpenAnimation) newTop.screen.stackAnimation else topScreenWrapper?.screen?.stackAnimation
            } else {
                // mTopScreen was not present before so newTop is the first screen added to a stack
                // and we don't want the animation when it is entering
                stackAnimation = StackAnimation.NONE
                goingForward = true
            }
        } else if (newTop != null && topScreenWrapper != null && topScreenWillChange) {
            // otherwise if we are performing top screen change we do "close animation"
            shouldUseOpenAnimation = false
            stackAnimation = topScreenWrapper?.screen?.stackAnimation
        }

        goingForward = shouldUseOpenAnimation

        if (shouldUseOpenAnimation &&
            newTop != null &&
            needsDrawReordering(newTop, stackAnimation) &&
            visibleBottom == null
        ) {
            // When using an open animation in which screens overlap (eg. fade_from_bottom or
            // slide_from_bottom), we want to draw the previous screens under the new one,
            // which is apparently not the default option. Android always draws the disappearing views
            // on top of the appearing one. We then reverse the order of the views so the new screen
            // appears on top of the previous ones. You can read more about in the comment
            // for the code we use to change that behavior:
            // https://github.com/airbnb/native-navigation/blob/9cf50bf9b751b40778f473f3b19fcfe2c4d40599/lib/android/src/main/java/com/airbnb/android/react/navigation/ScreenCoordinatorLayout.java#L18
            // Note: This should not be set in case there is only a single screen in stack or animation `none` is used.
            // Atm needsDrawReordering implementation guards that assuming that first screen on stack uses `NONE` animation.
            childrenDrawingOrderStrategy = ReverseOrder()
        } else if (newTop != null &&
            newTopAlreadyInStack &&
            topScreenWrapper?.isTranslucent() == true &&
            newTop.isTranslucent() == false
        ) {
            // In case where we dismiss multiple transparent views we want to ensure
            // that they are drawn in correct order - Android swaps them by default,
            // so we need to swap the swap to unswap :D
            val dismissedTransparentScreenApproxCount =
                stack
                    .asReversed()
                    .asSequence()
                    .takeWhile {
                        it !== newTop &&
                            it.isTranslucent()
                    }.count()
            if (dismissedTransparentScreenApproxCount > 1) {
                childrenDrawingOrderStrategy =
                    ReverseFromIndex(max(stack.lastIndex - dismissedTransparentScreenApproxCount + 1, 0))
            }
        }

        createTransaction().let { transaction ->
            if (stackAnimation != null) {
                transaction.setTweenAnimations(stackAnimation, shouldUseOpenAnimation)
            }

            // Remove all screens that are currently on stack, but should be dismissed, because they're
            // no longer rendered or were dismissed natively.
            stack
                .asSequence()
                .filter { wrapper ->
                    !screenWrappers.contains(wrapper) ||
                        dismissedWrappers.contains(
                            wrapper,
                        )
                }.forEach { wrapper -> transaction.remove(wrapper.fragment) }

            // Remove all screens underneath visibleBottom && these marked for preload, but keep newTop.
            screenWrappers
                .asSequence()
                .takeWhile { it !== visibleBottom }
                .filter { (it !== newTop && !dismissedWrappers.contains(it)) || it.screen.activityState === Screen.ActivityState.INACTIVE }
                .forEach { wrapper -> transaction.remove(wrapper.fragment) }

            // attach screens that just became visible
            if (visibleBottom != null && !visibleBottom.fragment.isAdded) {
                val top = newTop
                screenWrappers
                    .asSequence()
                    .dropWhile { it !== visibleBottom } // ignore all screens beneath the visible bottom
                    .forEach { wrapper ->
                        // TODO: It should be enough to dispatch this on commit action once.
                        transaction.add(id, wrapper.fragment).runOnCommit {
                            top?.screen?.bringToFront()
                        }
                    }
            } else if (newTop != null && !newTop.fragment.isAdded) {
                if (newTop.screen.requiresEnterTransitionPostponing()) {
                    newTop.fragment.postponeEnterTransition()
                }
                transaction.add(id, newTop.fragment)
            }

            topScreenWrapper = newTop as? ScreenStackFragmentWrapper
            stack.clear()
            stack.addAll(screenWrappers.asSequence().map { it as ScreenStackFragmentWrapper })

            turnOffA11yUnderTransparentScreen(visibleBottom)
            transaction.commitNowAllowingStateLoss()
        }
    }

    // only top visible screen should be accessible
    private fun turnOffA11yUnderTransparentScreen(visibleBottom: ScreenFragmentWrapper?) {
        if (screenWrappers.size > 1 && visibleBottom != null) {
            topScreenWrapper?.let {
                if (it.isTranslucent()) {
                    val screenFragmentsBeneathTop =
                        screenWrappers.slice(0 until screenWrappers.size - 1).asReversed()
                    // go from the top of the stack excluding the top screen
                    for (fragmentWrapper in screenFragmentsBeneathTop) {
                        fragmentWrapper.screen.changeAccessibilityMode(
                            IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS,
                        )

                        // don't change a11y below non-transparent screens
                        if (fragmentWrapper == visibleBottom) {
                            break
                        }
                    }
                }
            }
        }

        topScreen?.changeAccessibilityMode(IMPORTANT_FOR_ACCESSIBILITY_AUTO)
    }

    override fun notifyContainerUpdate() {
        stack.forEach { it.onContainerUpdate() }
    }

    private fun drawAndRelease() {
        // We make a copy of the drawingOps and use it to dispatch draws in order to be sure
        // that we do not modify the original list. There are cases when `op.draw` can call
        // `drawChild` which would modify the list through which we are iterating. See more:
        // https://github.com/software-mansion/react-native-screens/pull/1406
        val drawingOpsCopy = drawingOps
        drawingOps = ArrayList()
        for (op in drawingOpsCopy) {
            op.draw()
            drawingOpPool.add(op)
        }
    }

    override fun dispatchDraw(canvas: Canvas) {
        super.dispatchDraw(canvas)

        childrenDrawingOrderStrategy?.apply(drawingOps)

        drawAndRelease()
    }

    override fun drawChild(
        canvas: Canvas,
        child: View,
        drawingTime: Long,
    ): Boolean {
        drawingOps.add(
            obtainDrawingOp().apply {
                this.canvas = canvas
                this.child = child
                this.drawingTime = drawingTime
            },
        )
        return true
    }

    private fun performDraw(op: DrawingOp) {
        // Canvas parameter can not be null here https://developer.android.com/reference/android/view/ViewGroup#drawChild(android.graphics.Canvas,%20android.view.View,%20long)
        // So if we are passing null here, we would crash anyway
        super.drawChild(op.canvas!!, op.child, op.drawingTime)
    }

    // Can't use `drawingOpPool.removeLast` here due to issues with static name resolution in Android SDK 35+.
    // See: https://developer.android.com/about/versions/15/behavior-changes-15?hl=en#openjdk-api-changes
    private fun obtainDrawingOp(): DrawingOp = if (drawingOpPool.isEmpty()) DrawingOp() else drawingOpPool.removeAt(drawingOpPool.lastIndex)

    internal inner class DrawingOp {
        var canvas: Canvas? = null
        var child: View? = null
        var drawingTime: Long = 0

        fun draw() {
            performDraw(this)
            canvas = null
            child = null
            drawingTime = 0
        }
    }

    companion object {
        const val TAG = "ScreenStack"

        private fun needsDrawReordering(
            fragmentWrapper: ScreenFragmentWrapper,
            resolvedStackAnimation: StackAnimation?,
        ): Boolean {
            val stackAnimation = resolvedStackAnimation ?: fragmentWrapper.screen.stackAnimation
            // On Android sdk 33 and above the animation is different and requires draw reordering.
            // For React Native 0.70 and lower versions, `Build.VERSION_CODES.TIRAMISU` is not defined yet.
            // Hence, we're comparing numerical version here.
            return (
                Build.VERSION.SDK_INT >= 33 ||
                    stackAnimation === StackAnimation.SLIDE_FROM_BOTTOM ||
                    stackAnimation === StackAnimation.FADE_FROM_BOTTOM ||
                    stackAnimation === StackAnimation.IOS_FROM_RIGHT ||
                    stackAnimation === StackAnimation.IOS_FROM_LEFT
            ) &&
                stackAnimation !== StackAnimation.NONE
        }
    }
}
