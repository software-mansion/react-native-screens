package com.swmansion.rnscreens


import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.ObjectAnimator
import android.animation.TypeEvaluator
import android.content.Context
import android.content.res.Resources
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Point
import android.graphics.Rect
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.view.View
import android.view.ViewGroup
import android.view.animation.AccelerateDecelerateInterpolator
import android.view.animation.AccelerateInterpolator
import android.view.animation.DecelerateInterpolator
import android.view.animation.LinearInterpolator
import androidx.core.graphics.drawable.toBitmap
import androidx.core.view.ViewCompat
import androidx.transition.Fade
import androidx.transition.Transition
import androidx.transition.TransitionSet
import androidx.transition.TransitionValues
import com.facebook.drawee.drawable.ForwardingDrawable
import com.facebook.drawee.drawable.ScaleTypeDrawable
import com.facebook.drawee.drawable.ScalingUtils
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.util.ReactFindViewUtil
import com.facebook.react.views.image.ReactImageView
import com.swmansion.rnscreens.Screen.Easing.*
import com.swmansion.rnscreens.Screen.StackAnimation
import com.swmansion.rnscreens.events.StackFinishTransitioningEvent
import java.util.Collections
import kotlin.collections.ArrayList
import kotlin.collections.HashSet
import kotlin.math.roundToInt

class ScreenStack(context: Context?) : ScreenContainer<ScreenStackFragment>(context) {
    private val mStack = ArrayList<ScreenStackFragment>()
    private val mScreensToRemove: MutableSet<ScreenStackFragment> = HashSet()
    private val mDismissed: MutableSet<ScreenStackFragment> = HashSet()
    private val drawingOpPool: MutableList<DrawingOp> = ArrayList()
    private var drawingOps: MutableList<DrawingOp> = ArrayList()
    private var mTopScreen: ScreenStackFragment? = null
    private var mRemovalTransitionStarted = false
    private var isDetachingCurrentScreen = false
    private var reverseLastTwoChildren = false
    private var previousChildrenCount = 0
    var goingForward = false
    fun dismiss(screenFragment: ScreenStackFragment) {
        mDismissed.add(screenFragment)
        performUpdatesNow()
    }

    override val topScreen: Screen?
        get() = mTopScreen?.screen
    val rootScreen: Screen
        get() {
            var i = 0
            val size = screenCount
            while (i < size) {
                val screen = getScreenAt(i)
                if (!mDismissed.contains(screen.fragment)) {
                    return screen
                }
                i++
            }
            throw IllegalStateException("Stack has no root screen set")
        }

    override fun adapt(screen: Screen): ScreenStackFragment {
        return ScreenStackFragment(screen)
    }

    override fun startViewTransition(view: View) {
        super.startViewTransition(view)
        mRemovalTransitionStarted = true
    }

    override fun endViewTransition(view: View) {
        super.endViewTransition(view)
        if (mRemovalTransitionStarted) {
            mRemovalTransitionStarted = false
            dispatchOnFinishTransitioning()
        }
    }

    fun onViewAppearTransitionEnd() {
        if (!mRemovalTransitionStarted) {
            dispatchOnFinishTransitioning()
        }
    }

    private fun dispatchOnFinishTransitioning() {
        (context as ReactContext)
            .getNativeModule(UIManagerModule::class.java)
            ?.eventDispatcher
            ?.dispatchEvent(StackFinishTransitioningEvent(id))
    }

    override fun removeScreenAt(index: Int) {
        val toBeRemovedFragment = getScreenAt(index).fragment
        mDismissed.remove(toBeRemovedFragment)
        // We can't remove screen directly since it would break shared element animation
        // instead we remove the screen during the FragmentTransaction
        if (toBeRemovedFragment is ScreenStackFragment) {
            mScreensToRemove.add(toBeRemovedFragment)
        }
        performUpdatesNow()
    }

    override fun removeAllScreens() {
        mDismissed.clear()
        super.removeAllScreens()
    }

    override fun hasScreen(screenFragment: ScreenFragment?): Boolean {
        return super.hasScreen(screenFragment) && !mDismissed.contains(screenFragment)
    }

    override fun onUpdate() {
        // When going back from a nested stack with a single screen on it, we may hit an edge case
        // when all screens are dismissed and no screen is to be displayed on top. We need to gracefully
        // handle the case of newTop being NULL, which happens in several places below
        var newTop: ScreenStackFragment? = null // newTop is nullable, see the above comment ^
        var visibleBottom: ScreenStackFragment? = null // this is only set if newTop has TRANSPARENT_MODAL presentation mode
        isDetachingCurrentScreen = false // we reset it so the previous value is not used by mistake
        for (i in mScreenFragments.indices.reversed()) {
            val screen = mScreenFragments[i]
            if (!mDismissed.contains(screen) && !mScreensToRemove.contains(screen)) {
                if (newTop == null) {
                    newTop = screen
                } else {
                    visibleBottom = screen
                }
                if (!isTransparent(screen)) {
                    break
                }
            }
        }
        var shouldUseOpenAnimation = true
        var stackAnimation: StackAnimation? = null
        var sharedElementTransitions: List<Screen.SharedElementTransitionOptions>? = null
        // Only used for shared element transitions
        var transitionDuration: Long = SHARED_ELEMENT_TRANSITION_DEFAULT_DURATION
        if (!mStack.contains(newTop)) {
            // if new top screen wasn't on stack we do "open animation" so long it is not the very first
            // screen on stack
            if (mTopScreen != null && newTop != null) {
                // there was some other screen attached before
                // if the previous top screen does not exist anymore and the new top was not on the stack
                // before, probably replace or reset was called, so we play the "close animation".
                // Otherwise it's open animation
                val containsTopScreen = mTopScreen?.let { mScreenFragments.contains(it) } == true
                val isPushReplace = newTop.screen.replaceAnimation === Screen.ReplaceAnimation.PUSH
                shouldUseOpenAnimation = containsTopScreen || isPushReplace
                // if the replace animation is `push`, the new top screen provides the animation, otherwise the previous one
                if (shouldUseOpenAnimation) {
                    stackAnimation = newTop.screen.stackAnimation
                    sharedElementTransitions = newTop.screen.sharedElementTransitions
                    transitionDuration = newTop.screen.transitionDuration.toLong()
                } else {
                    stackAnimation = mTopScreen?.screen?.stackAnimation
                    sharedElementTransitions = mTopScreen?.screen?.sharedElementTransitions
                    transitionDuration = newTop.screen.transitionDuration.toLong()
                }
            } else if (mTopScreen == null && newTop != null) {
                // mTopScreen was not present before so newTop is the first screen added to a stack
                // and we don't want the animation when it is entering
                stackAnimation = StackAnimation.NONE
                goingForward = true
            }
        } else if (mTopScreen != null && mTopScreen != newTop) {
            // otherwise if we are performing top screen change we do "close animation"
            shouldUseOpenAnimation = false
            stackAnimation = mTopScreen?.screen?.stackAnimation
            sharedElementTransitions = mTopScreen?.screen?.sharedElementTransitions
            transitionDuration = mTopScreen?.screen?.transitionDuration?.toLong() ?: 0L
        }

        createTransaction().let {
            // animation logic start
            if (sharedElementTransitions != null && sharedElementTransitions.isNotEmpty()) {
                val fromScreen = mTopScreen?.screen
                val toScreen = newTop?.screen
                val sharedElementTransitionSet = TransitionSet()

                sharedElementTransitions.forEach { sharedElementTransitionOptions ->
                    var toId = sharedElementTransitionOptions.to
                    var fromId = sharedElementTransitionOptions.from
                    if (!shouldUseOpenAnimation) {
                        val temp = toId
                        toId = fromId
                        fromId = temp
                    }
                    if (toId != null && fromId != null) {
                        var fromView: View? = null

                        if (fromScreen != null) {
                            fromView = ReactFindViewUtil.findView(fromScreen, fromId)
                        }
                        var toView: View? = null
                        if (toScreen != null) {
                            toView = ReactFindViewUtil.findView(toScreen, toId)
                        }
                        if (fromView != null && toView != null) {
                            ViewCompat.setTransitionName(fromView, fromId)
                            ViewCompat.setTransitionName(toView, toId)
                            it.addSharedElement(fromView, toId)
                            val transition = SharedElementTransition(
                                context.resources,
                                sharedElementTransitionOptions,
                                transitionDuration
                            )
                            transition.addTarget(toView.transitionName)
                            transition.addTarget(fromView.transitionName)
                            sharedElementTransitionSet.addTransition(transition)
                        }
                    }
                }
                newTop?.sharedElementEnterTransition = sharedElementTransitionSet

                // Custom animation doesn't work with shared element transition, so we at lease
                // implement fade transition (which is the most common with shared element)
                val (enterTransition, exitTransition) = when(stackAnimation) {
                    StackAnimation.NONE -> Pair(null, null)
                    else -> Pair(Fade(), Fade())
                }
                enterTransition?.duration = transitionDuration
                exitTransition?.duration = transitionDuration
                if (shouldUseOpenAnimation) {
                    newTop?.enterTransition = enterTransition
                    mTopScreen?.exitTransition = exitTransition
                } else {
                    newTop?.enterTransition = exitTransition
                    mTopScreen?.exitTransition = enterTransition
                }
            } else if (stackAnimation != null) {
                if (shouldUseOpenAnimation) {
                    when (stackAnimation) {
                        StackAnimation.DEFAULT -> it.setCustomAnimations(R.anim.rns_default_enter_in, R.anim.rns_default_enter_out)
                        StackAnimation.NONE -> it.setCustomAnimations(R.anim.rns_no_animation_20, R.anim.rns_no_animation_20)
                        StackAnimation.FADE -> it.setCustomAnimations(R.anim.rns_fade_in, R.anim.rns_fade_out)
                        StackAnimation.SLIDE_FROM_RIGHT -> it.setCustomAnimations(R.anim.rns_slide_in_from_right, R.anim.rns_slide_out_to_left)
                        StackAnimation.SLIDE_FROM_LEFT -> it.setCustomAnimations(R.anim.rns_slide_in_from_left, R.anim.rns_slide_out_to_right)
                        StackAnimation.SLIDE_FROM_BOTTOM -> it.setCustomAnimations(
                            R.anim.rns_slide_in_from_bottom, R.anim.rns_no_animation_medium
                        )
                        StackAnimation.FADE_FROM_BOTTOM -> it.setCustomAnimations(R.anim.rns_fade_from_bottom, R.anim.rns_no_animation_350)
                    }
                } else {
                    when (stackAnimation) {
                        StackAnimation.DEFAULT -> it.setCustomAnimations(R.anim.rns_default_exit_in, R.anim.rns_default_exit_out)
                        StackAnimation.NONE -> it.setCustomAnimations(R.anim.rns_no_animation_20, R.anim.rns_no_animation_20)
                        StackAnimation.FADE -> it.setCustomAnimations(R.anim.rns_fade_in, R.anim.rns_fade_out)
                        StackAnimation.SLIDE_FROM_RIGHT -> it.setCustomAnimations(R.anim.rns_slide_in_from_left, R.anim.rns_slide_out_to_right)
                        StackAnimation.SLIDE_FROM_LEFT -> it.setCustomAnimations(R.anim.rns_slide_in_from_right, R.anim.rns_slide_out_to_left)
                        StackAnimation.SLIDE_FROM_BOTTOM -> it.setCustomAnimations(
                            R.anim.rns_no_animation_medium, R.anim.rns_slide_out_to_bottom
                        )
                        StackAnimation.FADE_FROM_BOTTOM -> it.setCustomAnimations(R.anim.rns_no_animation_250, R.anim.rns_fade_to_bottom)
                    }
                }
            }

            // animation logic end
            goingForward = shouldUseOpenAnimation

            if (shouldUseOpenAnimation &&
                newTop != null && needsDrawReordering(newTop) &&
                visibleBottom == null
            ) {
                // When using an open animation in which two screens overlap (eg. fade_from_bottom or
                // slide_from_bottom), we want to draw the previous screen under the new one,
                // which is apparently not the default option. Android always draws the disappearing view
                // on top of the appearing one. We then reverse the order of the views so the new screen
                // appears on top of the previous one. You can read more about in the comment
                // for the code we use to change that behavior:
                // https://github.com/airbnb/native-navigation/blob/9cf50bf9b751b40778f473f3b19fcfe2c4d40599/lib/android/src/main/java/com/airbnb/android/react/navigation/ScreenCoordinatorLayout.java#L18
                isDetachingCurrentScreen = true
            }

            // remove all screens previously on stack
            for (screen in mStack) {
                if (!mScreenFragments.contains(screen) ||
                    mDismissed.contains(screen) ||
                    mScreensToRemove.contains(screen)) {
                    it.remove(screen)
                }
            }
            for (screen in mScreenFragments) {
                // Stop detaching screens when reaching visible bottom. All screens above bottom should be
                // visible.
                if (screen === visibleBottom) {
                    break
                }
                // detach all screens that should not be visible
                if (screen !== newTop &&
                    !mDismissed.contains(screen) &&
                    !mScreensToRemove.contains(screen)) {
                    it.remove(screen)
                }
            }

            // attach screens that just became visible
            if (visibleBottom != null && !visibleBottom.isAdded) {
                val top = newTop
                var beneathVisibleBottom = true
                for (screen in mScreenFragments) {
                    // ignore all screens beneath the visible bottom
                    if (beneathVisibleBottom) {
                        beneathVisibleBottom = if (screen === visibleBottom) {
                            false
                        } else continue
                    }
                    // when first visible screen found, make all screens after that visible
                    it.add(id, screen).runOnCommit { top?.screen?.bringToFront() }
                }
            } else if (newTop != null && !newTop.isAdded) {
                it.add(id, newTop)
            }

            mScreensToRemove.forEach { frag ->
                frag.screen.container = null
                mScreenFragments.remove(frag)
            }
            mScreensToRemove.clear()
            mTopScreen = newTop
            mStack.clear()
            mStack.addAll(mScreenFragments)

            turnOffA11yUnderTransparentScreen(visibleBottom)

            it.commitNowAllowingStateLoss()
        }
    }

    // only top visible screen should be accessible
    private fun turnOffA11yUnderTransparentScreen(visibleBottom: ScreenStackFragment?) {
        if (mScreenFragments.size > 1 && visibleBottom != null) {
            mTopScreen?.let {
                if (isTransparent(it)) {
                    val screenFragmentsBeneathTop = mScreenFragments.slice(0 until mScreenFragments.size - 1).asReversed()
                    // go from the top of the stack excluding the top screen
                    for (screenFragment in screenFragmentsBeneathTop) {
                        screenFragment.screen.changeAccessibilityMode(IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS)

                        // don't change a11y below non-transparent screens
                        if (screenFragment == visibleBottom) {
                            break
                        }
                    }
                }
            }
        }

        topScreen?.changeAccessibilityMode(IMPORTANT_FOR_ACCESSIBILITY_AUTO)
    }

    override fun notifyContainerUpdate() {
        for (screen in mStack) {
            screen.onContainerUpdate()
        }
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

    override fun drawChild(canvas: Canvas, child: View, drawingTime: Long): Boolean {
        drawingOps.add(obtainDrawingOp().set(canvas, child, drawingTime))
        return true
    }

    private fun performDraw(op: DrawingOp) {
        super.drawChild(op.canvas, op.child, op.drawingTime)
    }

    private fun obtainDrawingOp(): DrawingOp {
        return if (drawingOpPool.isEmpty()) {
            DrawingOp()
        } else drawingOpPool.removeAt(drawingOpPool.size - 1)
    }

    private inner class DrawingOp {
        var canvas: Canvas? = null
        var child: View? = null
        var drawingTime: Long = 0
        operator fun set(canvas: Canvas?, child: View?, drawingTime: Long): DrawingOp {
            this.canvas = canvas
            this.child = child
            this.drawingTime = drawingTime
            return this
        }

        fun draw() {
            performDraw(this)
            canvas = null
            child = null
            drawingTime = 0
        }
    }

    private inner class SharedElementTransition(
        res: Resources,
        options: Screen.SharedElementTransitionOptions,
        defaultDuration: Long
    ): Transition() {
        private val mOptions = options
        private val mRes = res

        init {
            startDelay = options.delay.toLong()
            duration =
                if (options.duration > 0) options.duration.toLong()
                else defaultDuration
            interpolator = when(options.easing) {
                LINEAR -> LinearInterpolator()
                EASE_IN -> AccelerateInterpolator()
                EASE_OUT -> DecelerateInterpolator()
                EASE_IN_OUT -> AccelerateDecelerateInterpolator()
            }
        }

        override fun captureStartValues(transitionValues: TransitionValues) {
            captureValues(transitionValues)
        }

        override fun captureEndValues(transitionValues: TransitionValues) {
            captureValues(transitionValues)
        }

        private fun captureValues(transitionValues: TransitionValues) {
            val location = getViewLocation(transitionValues.view)
            transitionValues.values[PROP_BOUNDS] = Rect(
                location.x,
                location.y,
                location.x + transitionValues.view.width,
                location.y + transitionValues.view.height,
            )
        }

        override fun createAnimator(
            sceneRoot: ViewGroup,
            startValues: TransitionValues?, endValues: TransitionValues?
        ): Animator? {
            if (startValues == null || endValues == null)  {
                return null
            }
            val startView = startValues.view
            val endView = endValues.view
            val startBounds = startValues.values[PROP_BOUNDS] as Rect?
            val endBounds = endValues.values[PROP_BOUNDS] as Rect?
            if (startBounds == null || endBounds == null)  {
                return null
            }
            val sceneLocation = getViewLocation(sceneRoot)
            val startX = startBounds.left - sceneLocation.x
            val startY = startBounds.top - sceneLocation.y
            val endX = endBounds.left - sceneLocation.x
            val endY = endBounds.top - sceneLocation.y
            var targetX = endX
            var targetY = endY

            if (mOptions.resizeMode === Screen.ResizeMode.NONE) {
                when (mOptions.align) {
                    Screen.Align.LEFT_TOP -> {
                        targetX = endX
                        targetY = endY
                    }
                    Screen.Align.LEFT_CENTER -> {
                        targetX = endX
                        targetY = endY + (endView.height - startView.height) / 2
                    }
                    Screen.Align.LEFT_BOTTOM -> {
                        targetX = endX
                        targetY = endY + (endView.height - startView.height)
                    }
                    Screen.Align.CENTER_TOP -> {
                        targetX = endX + (endView.width - startView.width) / 2
                        targetY = endY
                    }
                    Screen.Align.CENTER_CENTER -> {
                        targetX = endX + (endView.width - startView.width) / 2
                        targetY = endY + (endView.height - startView.height) / 2
                    }
                    Screen.Align.CENTER_BOTTOM -> {
                        targetX = endX + (endView.width - startView.width) / 2
                        targetY = endY + (endView.height - startView.height)
                    }
                    Screen.Align.RIGHT_TOP -> {
                        targetX = endX + (endView.width - startView.width)
                        targetY = endY
                    }
                    Screen.Align.RIGHT_CENTER -> {
                        targetX = endX + (endView.width - startView.width)
                        targetY = endY + (endView.height - startView.height) / 2
                    }
                    Screen.Align.RIGHT_BOTTOM -> {
                        targetX = endX + (endView.width - startView.width)
                        targetY = endY + (endView.height - startView.height)
                    }
                }
            }

            val targetWidth = when (mOptions.resizeMode)  {
                Screen.ResizeMode.RESIZE -> endBounds.width()
                else -> startBounds.width()
            }
            val targetHeight = when (mOptions.resizeMode)  {
                Screen.ResizeMode.RESIZE -> endBounds.height()
                else -> startBounds.height()
            }

            var drawable: Drawable? = null
            if (startView is ReactImageView) {
                val scaleDrawable = ScalingUtils.getActiveScaleTypeDrawable(startView.drawable)
                var innerDrawable = scaleDrawable?.drawable

                // React native image view drawable doesn't implement
                // correctly newState() so we have to use bitmap to clone the drawable
                while (innerDrawable is ForwardingDrawable)  {
                    innerDrawable = innerDrawable.drawable
                }
                if (innerDrawable != null) {
                    val bitmap = innerDrawable.toBitmap()
                    val bitmapDrawable = BitmapDrawable(mRes, bitmap)
                    drawable = ScaleTypeDrawable(bitmapDrawable, scaleDrawable?.scaleType)
                }
            } else {
                val bitmap = Bitmap.createBitmap(
                    startBounds.width(), startBounds.height(),
                    Bitmap.Config.ARGB_8888
                )
                val canvas = Canvas(bitmap)
                startView.draw(canvas)
                drawable = BitmapDrawable(mRes, bitmap)
            }
            if (drawable == null) {
                return null
            }

            sceneRoot.overlay.add(drawable)
            drawable.bounds = Rect(
                startX,
                startY,
                startBounds.right,
                startBounds.bottom
            )

            val fromAlpha = startView.alpha
            if (!mOptions.showFromElementDuringAnimation) {
                startView.alpha = 0f
            }
            val endAlpha = endView.alpha
            if (!mOptions.showFromElementDuringAnimation) {
                endView.alpha = 0f
            }

            val objectAnimator = ObjectAnimator.ofObject(
                drawable,
                "bounds",
                object : TypeEvaluator<Rect> {
                    private val mRect = Rect()
                    override fun evaluate(ratio: Float, fromRect: Rect, targetRect: Rect): Rect {
                        mRect.set(
                            (fromRect.left + (targetRect.left - fromRect.left) * ratio).roundToInt(),
                            (fromRect.top + (targetRect.top - fromRect.top) * ratio).roundToInt(),
                            (fromRect.right + (targetRect.right - fromRect.right) * ratio).roundToInt(),
                            (fromRect.bottom + (targetRect.bottom - fromRect.bottom) * ratio).roundToInt()
                        )
                        return mRect
                    }
                },
                startBounds,
                Rect(
                    targetX,
                    targetY,
                    targetX + targetWidth,
                    targetY + targetHeight,
                )
            )
            objectAnimator.addListener(object : AnimatorListenerAdapter() {
                override fun onAnimationEnd(animation: Animator) {
                    sceneRoot.overlay.remove(drawable)
                    startView.alpha = fromAlpha
                    endView.alpha = endAlpha
                }
            })
            return objectAnimator
        }
    }


    companion object {
        private fun isTransparent(fragment: ScreenStackFragment): Boolean {
            return (
                fragment.screen.stackPresentation
                    === Screen.StackPresentation.TRANSPARENT_MODAL
                )
        }

        private fun needsDrawReordering(fragment: ScreenStackFragment): Boolean {
            return (
                fragment.screen.stackAnimation === StackAnimation.SLIDE_FROM_BOTTOM ||
                    fragment.screen.stackAnimation === StackAnimation.FADE_FROM_BOTTOM
                )
        }

        private const val SHARED_ELEMENT_TRANSITION_DEFAULT_DURATION = 400L

        private const val PROP_BOUNDS = "rns:sharedElementTransition:bounds"

        private val mLocation = IntArray(2)
        private fun getViewLocation(view: View): Point {
            view.getLocationInWindow(mLocation)
            return Point(mLocation[0], mLocation[1])
        }
    }
}
