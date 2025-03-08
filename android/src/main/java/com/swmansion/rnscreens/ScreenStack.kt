package com.swmansion.rnscreens

import android.content.Context
import android.graphics.Canvas
import android.os.Build
import android.view.View
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.swmansion.rnscreens.Screen.StackAnimation
import com.swmansion.rnscreens.bottomsheet.isSheetFitToContents
import com.swmansion.rnscreens.events.StackFinishTransitioningEvent
import com.swmansion.rnscreens.utils.setTweenAnimations
import java.util.Collections
import kotlin.collections.ArrayList

class ScreenStack(
    context: Context?,
) : ScreenContainer(context) {
    private val stack = ArrayList<ScreenStackFragmentWrapper>()
    private val dismissedWrappers: MutableSet<ScreenStackFragmentWrapper> = HashSet()
    private val drawingOpPool: MutableList<DrawingOp> = ArrayList()
    private var drawingOps: MutableList<DrawingOp> = ArrayList()
    private var topScreenWrapper: ScreenStackFragmentWrapper? = null
    private var removalTransitionStarted = false
    private var isDetachingCurrentScreen = false
    private var reverseLastTwoChildren = false
    private var previousChildrenCount = 0
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
        super.startViewTransition(view)
        removalTransitionStarted = true
    }

    override fun endViewTransition(view: View) {
        super.endViewTransition(view)
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
        var visibleBottom: ScreenFragmentWrapper? =
            null // this is only set if newTop has one of transparent presentation modes
        isDetachingCurrentScreen = false // we reset it so the previous value is not used by mistake

        // Determine new first & last visible screens.
        // Scope function to limit the scope of locals.
        run {
            val notDismissedWrappers =
                screenWrappers
                    .asReversed()
                    .asSequence()
                    .filter { !dismissedWrappers.contains(it) && it.screen.activityState !== Screen.ActivityState.INACTIVE }

            newTop = notDismissedWrappers.firstOrNull()
            visibleBottom =
                notDismissedWrappers
                    .dropWhile { it.screen.isTransparent() }
                    .firstOrNull()
                    ?.takeUnless { it === newTop }
        }

        var shouldUseOpenAnimation = true
        var stackAnimation: StackAnimation? = null
        if (!stack.contains(newTop)) {
            // if new top screen wasn't on stack we do "open animation" so long it is not the very first
            // screen on stack
            if (topScreenWrapper != null && newTop != null) {
                // there was some other screen attached before
                // if the previous top screen does not exist anymore and the new top was not on the stack
                // before, probably replace or reset was called, so we play the "close animation".
                // Otherwise it's open animation
                val containsTopScreen = topScreenWrapper?.let { screenWrappers.contains(it) } == true
                val isPushReplace = newTop.screen.replaceAnimation === Screen.ReplaceAnimation.PUSH
                shouldUseOpenAnimation = containsTopScreen || isPushReplace
                // if the replace animation is `push`, the new top screen provides the animation, otherwise the previous one
                stackAnimation = if (shouldUseOpenAnimation) newTop.screen.stackAnimation else topScreenWrapper?.screen?.stackAnimation
            } else if (topScreenWrapper == null && newTop != null) {
                // mTopScreen was not present before so newTop is the first screen added to a stack
                // and we don't want the animation when it is entering
                stackAnimation = StackAnimation.NONE
                goingForward = true
            }
        } else if (topScreenWrapper != null && topScreenWrapper != newTop) {
            // otherwise if we are performing top screen change we do "close animation"
            shouldUseOpenAnimation = false
            stackAnimation = topScreenWrapper?.screen?.stackAnimation
        }

        createTransaction().let { transaction ->
            if (stackAnimation != null) {
                transaction.setTweenAnimations(stackAnimation, shouldUseOpenAnimation)
            }

            goingForward = shouldUseOpenAnimation

            if (shouldUseOpenAnimation &&
                newTop != null &&
                needsDrawReordering(newTop, stackAnimation) &&
                visibleBottom == null
            ) {
                // When using an open animation in which two screens overlap (eg. fade_from_bottom or
                // slide_from_bottom), we want to draw the previous screen under the new one,
                // which is apparently not the default option. Android always draws the disappearing view
                // on top of the appearing one. We then reverse the order of the views so the new screen
                // appears on top of the previous one. You can read more about in the comment
                // for the code we use to change that behavior:
                // https://github.com/airbnb/native-navigation/blob/9cf50bf9b751b40778f473f3b19fcfe2c4d40599/lib/android/src/main/java/com/airbnb/android/react/navigation/ScreenCoordinatorLayout.java#L18
                // Note: This should not be set in case there is only a single screen in stack or animation `none` is used. Atm needsDrawReordering implementation guards that assuming that first screen on stack uses `NONE` animation.
                isDetachingCurrentScreen = true
            }

            // Remove all screens that are currently on stack, but should be dismissed, because they're
            // no longer rendered or were dismissed natively.
            stack
                .asSequence()
                .filter { wrapper -> !screenWrappers.contains(wrapper) || dismissedWrappers.contains(wrapper) }
                .forEach { wrapper -> transaction.remove(wrapper.fragment) }

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
                if (!BuildConfig.IS_NEW_ARCHITECTURE_ENABLED && newTop.screen.isSheetFitToContents()) {
                    // On old architecture the content wrapper might not have received its frame yet,
                    // which is required to determine height of the sheet after animation. Therefore
                    // we delay the transition and trigger it after views receive the layout.
                    newTop.fragment.postponeEnterTransition()
                }
                transaction.add(id, newTop.fragment)
            }
            topScreenWrapper = newTop as? ScreenStackFragmentWrapper
            stack.clear()
            stack.addAll(screenWrappers.map { it as ScreenStackFragmentWrapper })

            turnOffA11yUnderTransparentScreen(visibleBottom)
            transaction.commitNowAllowingStateLoss()
        }
    }

    // only top visible screen should be accessible
    private fun turnOffA11yUnderTransparentScreen(visibleBottom: ScreenFragmentWrapper?) {
        if (screenWrappers.size > 1 && visibleBottom != null) {
            topScreenWrapper?.let {
                if (it.screen.isTransparent()) {
                    val screenFragmentsBeneathTop = screenWrappers.slice(0 until screenWrappers.size - 1).asReversed()
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

    // below methods are taken from
    // https://github.com/airbnb/native-navigation/blob/9cf50bf9b751b40778f473f3b19fcfe2c4d40599/lib/android/src/main/java/com/airbnb/android/react/navigation/ScreenCoordinatorLayout.java#L43
    // and are used to swap the order of drawing views when navigating forward with the transitions
    // that are making transitioning fragments appear one on another. See more info in the comment to
    // the linked class.
    override fun removeView(view: View) {
        // we set this property to reverse the order of drawing views
        // when we want to push new fragment on top of the previous one and their animations collide.
        // More information in:
        // https://github.com/airbnb/native-navigation/blob/9cf50bf9b751b40778f473f3b19fcfe2c4d40599/lib/android/src/main/java/com/airbnb/android/react/navigation/ScreenCoordinatorLayout.java#L17
        if (isDetachingCurrentScreen) {
            isDetachingCurrentScreen = false
            reverseLastTwoChildren = true
        }
        super.removeView(view)
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

        // check the view removal is completed (by comparing the previous children count)
        if (drawingOps.size < previousChildrenCount) {
            reverseLastTwoChildren = false
        }
        previousChildrenCount = drawingOps.size
        if (reverseLastTwoChildren && drawingOps.size >= 2) {
            Collections.swap(drawingOps, drawingOps.size - 1, drawingOps.size - 2)
        }
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

    private inner class DrawingOp {
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
            val stackAnimation = if (resolvedStackAnimation != null) resolvedStackAnimation else fragmentWrapper.screen.stackAnimation
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
