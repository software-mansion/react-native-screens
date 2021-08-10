package com.swmansion.rnscreens;

import android.content.Context;
import android.graphics.Canvas;
import android.view.View;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ScreenStack extends ScreenContainer<ScreenStackFragment> {

  private static final String BACK_STACK_TAG = "RN_SCREEN_LAST";

  private final ArrayList<ScreenStackFragment> mStack = new ArrayList<>();
  private final Set<ScreenStackFragment> mDismissed = new HashSet<>();
  private final List<DrawingOp> drawingOpPool = new ArrayList<>();
  private final List<DrawingOp> drawingOps = new ArrayList<>();

  private ScreenStackFragment mTopScreen = null;
  private final FragmentManager.OnBackStackChangedListener mBackStackListener =
      new FragmentManager.OnBackStackChangedListener() {
        @Override
        public void onBackStackChanged() {
          if (mFragmentManager.getBackStackEntryCount() == 0) {
            // when back stack entry count hits 0 it means the user's navigated back using hw back
            // button. As the "fake" transaction we installed on the back stack does nothing we need
            // to handle back navigation on our own.
            dismiss(mTopScreen);
          }
        }
      };

  private final FragmentManager.FragmentLifecycleCallbacks mLifecycleCallbacks =
      new FragmentManager.FragmentLifecycleCallbacks() {
        @Override
        public void onFragmentResumed(FragmentManager fm, Fragment f) {
          if (mTopScreen == f) {
            setupBackHandlerIfNeeded(mTopScreen);
          }
        }
      };
  private boolean mRemovalTransitionStarted = false;
  private boolean isDetachingCurrentScreen = false;
  private boolean reverseLastTwoChildren = false;
  private int previousChildrenCount = 0;

  public ScreenStack(Context context) {
    super(context);
  }

  private static boolean isSystemAnimation(Screen.StackAnimation stackAnimation) {
    return stackAnimation == Screen.StackAnimation.DEFAULT
        || stackAnimation == Screen.StackAnimation.FADE
        || stackAnimation == Screen.StackAnimation.NONE;
  }

  private static boolean isTransparent(ScreenStackFragment fragment) {
    return fragment.getScreen().getStackPresentation()
        == Screen.StackPresentation.TRANSPARENT_MODAL;
  }

  private static boolean needsDrawReordering(ScreenStackFragment fragment) {
    return fragment.getScreen().getStackAnimation() == Screen.StackAnimation.SLIDE_FROM_BOTTOM
        || fragment.getScreen().getStackAnimation() == Screen.StackAnimation.FADE_FROM_BOTTOM;
  }

  public void dismiss(ScreenStackFragment screenFragment) {
    mDismissed.add(screenFragment);
    markUpdated();
  }

  @Override
  public @Nullable Screen getTopScreen() {
    return mTopScreen != null ? mTopScreen.getScreen() : null;
  }

  public Screen getRootScreen() {
    for (int i = 0, size = getScreenCount(); i < size; i++) {
      Screen screen = getScreenAt(i);
      if (!mDismissed.contains(screen.getFragment())) {
        return screen;
      }
    }
    throw new IllegalStateException("Stack has no root screen set");
  }

  @Override
  protected ScreenStackFragment adapt(Screen screen) {
    return new ScreenStackFragment(screen);
  }

  @Override
  protected void onDetachedFromWindow() {
    if (mFragmentManager != null) {
      mFragmentManager.removeOnBackStackChangedListener(mBackStackListener);
      mFragmentManager.unregisterFragmentLifecycleCallbacks(mLifecycleCallbacks);
      if (!mFragmentManager.isStateSaved() && !mFragmentManager.isDestroyed()) {
        // State save means that the container where fragment manager was installed has been
        // unmounted.
        // This could happen as a result of dismissing nested stack. In such a case we don't need to
        // reset back stack as it'd result in a crash caused by the fact the fragment manager is no
        // longer attached.
        mFragmentManager.popBackStack(BACK_STACK_TAG, FragmentManager.POP_BACK_STACK_INCLUSIVE);
      }
    }
    super.onDetachedFromWindow();
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    mFragmentManager.registerFragmentLifecycleCallbacks(mLifecycleCallbacks, false);
  }

  @Override
  public void startViewTransition(View view) {
    super.startViewTransition(view);
    mRemovalTransitionStarted = true;
  }

  @Override
  public void endViewTransition(View view) {
    super.endViewTransition(view);
    if (mRemovalTransitionStarted) {
      mRemovalTransitionStarted = false;
      dispatchOnFinishTransitioning();
    }
  }

  public void onViewAppearTransitionEnd() {
    if (!mRemovalTransitionStarted) {
      dispatchOnFinishTransitioning();
    }
  }

  private void dispatchOnFinishTransitioning() {
    ((ReactContext) getContext())
        .getNativeModule(UIManagerModule.class)
        .getEventDispatcher()
        .dispatchEvent(new StackFinishTransitioningEvent(getId()));
  }

  @Override
  protected void removeScreenAt(int index) {
    Screen toBeRemoved = getScreenAt(index);
    mDismissed.remove(toBeRemoved.getFragment());
    super.removeScreenAt(index);
  }

  @Override
  protected void removeAllScreens() {
    mDismissed.clear();
    super.removeAllScreens();
  }

  @Override
  protected boolean hasScreen(ScreenFragment screenFragment) {
    return super.hasScreen(screenFragment) && !mDismissed.contains(screenFragment);
  }

  @Override
  protected void performUpdate() {

    // When going back from a nested stack with a single screen on it, we may hit an edge case
    // when all screens are dismissed and no screen is to be displayed on top. We need to gracefully
    // handle the case of newTop being NULL, which happens in several places below
    ScreenStackFragment newTop = null; // newTop is nullable, see the above comment ^
    ScreenStackFragment visibleBottom =
        null; // this is only set if newTop has TRANSPARENT_MODAL presentation mode
    isDetachingCurrentScreen = false; // we reset it so the previous value is not used by mistake

    for (int i = mScreenFragments.size() - 1; i >= 0; i--) {
      ScreenStackFragment screen = mScreenFragments.get(i);
      if (!mDismissed.contains(screen)) {
        if (newTop == null) {
          newTop = screen;
        } else {
          visibleBottom = screen;
        }
        if (!isTransparent(screen)) {
          break;
        }
      }
    }

    boolean shouldUseOpenAnimation = true;
    int transition = FragmentTransaction.TRANSIT_FRAGMENT_OPEN;
    Screen.StackAnimation stackAnimation = null;

    if (!mStack.contains(newTop)) {
      // if new top screen wasn't on stack we do "open animation" so long it is not the very first
      // screen on stack
      if (mTopScreen != null && newTop != null) {
        // there was some other screen attached before
        // if the previous top screen does not exist anymore and the new top was not on the stack
        // before, probably replace or reset was called, so we play the "close animation".
        // Otherwise it's open animation
        shouldUseOpenAnimation =
            mScreenFragments.contains(mTopScreen)
                || newTop.getScreen().getReplaceAnimation() != Screen.ReplaceAnimation.POP;
        stackAnimation = newTop.getScreen().getStackAnimation();
      } else if (mTopScreen == null && newTop != null) {
        // mTopScreen was not present before so newTop is the first screen added to a stack
        // and we don't want the animation when it is entering, but we want to send the
        // willAppear and Appear events to the user, which won't be sent by default if Screen's
        // stack animation is not NONE (see check for stackAnimation in onCreateAnimation in
        // ScreenStackFragment).
        // We don't do it if the stack is nested since the parent will trigger these events in child
        stackAnimation = Screen.StackAnimation.NONE;
        if (newTop.getScreen().getStackAnimation() != Screen.StackAnimation.NONE && !isNested()) {
          newTop.dispatchOnWillAppear();
          newTop.dispatchOnAppear();
        }
      }
    } else if (mTopScreen != null && !mTopScreen.equals(newTop)) {
      // otherwise if we are performing top screen change we do "close animation"
      shouldUseOpenAnimation = false;
      stackAnimation = mTopScreen.getScreen().getStackAnimation();
    }

    // animation logic start
    if (stackAnimation != null) {
      if (shouldUseOpenAnimation) {
        transition = FragmentTransaction.TRANSIT_FRAGMENT_OPEN;

        switch (stackAnimation) {
          case SLIDE_FROM_RIGHT:
            getOrCreateTransaction()
                .setCustomAnimations(R.anim.rns_slide_in_from_right, R.anim.rns_slide_out_to_left);
            break;
          case SLIDE_FROM_LEFT:
            getOrCreateTransaction()
                .setCustomAnimations(R.anim.rns_slide_in_from_left, R.anim.rns_slide_out_to_right);
            break;
          case SLIDE_FROM_BOTTOM:
            getOrCreateTransaction()
                .setCustomAnimations(
                    R.anim.rns_slide_in_from_bottom, R.anim.rns_no_animation_medium);
            break;
          case FADE_FROM_BOTTOM:
            getOrCreateTransaction()
                .setCustomAnimations(R.anim.rns_fade_from_bottom, R.anim.rns_no_animation_350);
            break;
        }
      } else {
        transition = FragmentTransaction.TRANSIT_FRAGMENT_CLOSE;
        switch (stackAnimation) {
          case SLIDE_FROM_RIGHT:
            getOrCreateTransaction()
                .setCustomAnimations(R.anim.rns_slide_in_from_left, R.anim.rns_slide_out_to_right);
            break;
          case SLIDE_FROM_LEFT:
            getOrCreateTransaction()
                .setCustomAnimations(R.anim.rns_slide_in_from_right, R.anim.rns_slide_out_to_left);
            break;
          case SLIDE_FROM_BOTTOM:
            getOrCreateTransaction()
                .setCustomAnimations(
                    R.anim.rns_no_animation_medium, R.anim.rns_slide_out_to_bottom);
            break;
          case FADE_FROM_BOTTOM:
            getOrCreateTransaction()
                .setCustomAnimations(R.anim.rns_no_animation_250, R.anim.rns_fade_to_bottom);
            break;
        }
      }
    }

    if (stackAnimation == Screen.StackAnimation.NONE) {
      transition = FragmentTransaction.TRANSIT_NONE;
    }
    if (stackAnimation == Screen.StackAnimation.FADE) {
      transition = FragmentTransaction.TRANSIT_FRAGMENT_FADE;
    }

    if (stackAnimation != null && isSystemAnimation(stackAnimation)) {
      getOrCreateTransaction().setTransition(transition);
    }
    // animation logic end

    if (shouldUseOpenAnimation
        && newTop != null
        && needsDrawReordering(newTop)
        && visibleBottom == null) {
      // When using an open animation in which two screens overlap (eg. fade_from_bottom or
      // slide_from_bottom), we want to draw the previous screen under the new one,
      // which is apparently not the default option. Android always draws the disappearing view
      // on top of the appearing one. We then reverse the order of the views so the new screen
      // appears on top of the previous one. You can read more about in the comment
      // for the code we use to change that behavior:
      // https://github.com/airbnb/native-navigation/blob/9cf50bf9b751b40778f473f3b19fcfe2c4d40599/lib/android/src/main/java/com/airbnb/android/react/navigation/ScreenCoordinatorLayout.java#L18
      isDetachingCurrentScreen = true;
    }

    // remove all screens previously on stack
    for (ScreenStackFragment screen : mStack) {
      if (!mScreenFragments.contains(screen) || mDismissed.contains(screen)) {
        getOrCreateTransaction().remove(screen);
      }
    }

    for (ScreenStackFragment screen : mScreenFragments) {
      // Stop detaching screens when reaching visible bottom. All screens above bottom should be
      // visible.
      if (screen == visibleBottom) {
        break;
      }
      // detach all screens that should not be visible
      if (screen != newTop && !mDismissed.contains(screen)) {
        getOrCreateTransaction().remove(screen);
      }
    }

    // attach screens that just became visible
    if (visibleBottom != null && !visibleBottom.isAdded()) {
      final ScreenStackFragment top = newTop;
      boolean beneathVisibleBottom = true;

      for (ScreenStackFragment screen : mScreenFragments) {
        // ignore all screens beneath the visible bottom
        if (beneathVisibleBottom) {
          if (screen == visibleBottom) {
            beneathVisibleBottom = false;
          } else continue;
        }
        // when first visible screen found, make all screens after that visible
        getOrCreateTransaction()
            .add(getId(), screen)
            .runOnCommit(
                new Runnable() {
                  @Override
                  public void run() {
                    top.getScreen().bringToFront();
                  }
                });
      }
    } else if (newTop != null && !newTop.isAdded()) {
      getOrCreateTransaction().add(getId(), newTop);
    }

    mTopScreen = newTop;

    mStack.clear();
    mStack.addAll(mScreenFragments);

    tryCommitTransaction();

    if (mTopScreen != null) {
      setupBackHandlerIfNeeded(mTopScreen);
    }
  }

  @Override
  protected void notifyContainerUpdate() {
    for (ScreenStackFragment screen : mStack) {
      screen.onContainerUpdate();
    }
  }

  /**
   * The below method sets up fragment manager's back stack in a way that it'd trigger our back
   * stack change listener when hw back button is clicked.
   *
   * <p>Because back stack by default rolls back the transaction the stack entry is associated with
   * we generate a "fake" transaction that hides and shows the top fragment. As a result when back
   * stack entry is rolled back nothing happens and we are free to handle back navigation on our own
   * in `mBackStackListener`.
   *
   * <p>We pop that "fake" transaction each time we update stack and we add a new one in case the
   * top screen is allowed to be dismissed using hw back button. This way in the listener we can
   * tell if back button was pressed based on the count of the items on back stack. We expect 0
   * items in case hw back is pressed because we try to keep the number of items at 1 by always
   * resetting and adding new items. In case we don't add a new item to back stack we remove
   * listener so that it does not get triggered.
   *
   * <p>It is important that we don't install back handler when stack contains a single screen as in
   * that case we want the parent navigator or activity handler to take over.
   */
  private void setupBackHandlerIfNeeded(ScreenStackFragment topScreen) {
    if (!mTopScreen.isResumed()) {
      // if the top fragment is not in a resumed state, adding back stack transaction would throw.
      // In such a case we skip installing back handler and use FragmentLifecycleCallbacks to get
      // notified when it gets resumed so that we can install the handler.
      return;
    }
    mFragmentManager.removeOnBackStackChangedListener(mBackStackListener);
    mFragmentManager.popBackStack(BACK_STACK_TAG, FragmentManager.POP_BACK_STACK_INCLUSIVE);
    ScreenStackFragment firstScreen = null;
    for (int i = 0, size = mStack.size(); i < size; i++) {
      ScreenStackFragment screen = mStack.get(i);
      if (!mDismissed.contains(screen)) {
        firstScreen = screen;
        break;
      }
    }

    if (topScreen != firstScreen && topScreen.isDismissable()) {
      mFragmentManager
          .beginTransaction()
          .show(topScreen)
          .addToBackStack(BACK_STACK_TAG)
          .setPrimaryNavigationFragment(topScreen)
          .commitAllowingStateLoss();
      mFragmentManager.addOnBackStackChangedListener(mBackStackListener);
    }
  }

  // below methods are taken from
  // https://github.com/airbnb/native-navigation/blob/9cf50bf9b751b40778f473f3b19fcfe2c4d40599/lib/android/src/main/java/com/airbnb/android/react/navigation/ScreenCoordinatorLayout.java#L43
  // and are used to swap the order of drawing views when navigating forward with the transitions
  // that are making transitioning fragments appear one on another. See more info in the comment to
  // the linked class.
  @Override
  public void removeView(final View view) {
    // we set this property to reverse the order of drawing views
    // when we want to push new fragment on top of the previous one and their animations collide.
    // More information in:
    // https://github.com/airbnb/native-navigation/blob/9cf50bf9b751b40778f473f3b19fcfe2c4d40599/lib/android/src/main/java/com/airbnb/android/react/navigation/ScreenCoordinatorLayout.java#L17
    if (isDetachingCurrentScreen) {
      isDetachingCurrentScreen = false;
      reverseLastTwoChildren = true;
    }

    super.removeView(view);
  }

  private void drawAndRelease() {
    for (int i = 0; i < drawingOps.size(); i++) {
      DrawingOp op = drawingOps.get(i);
      op.draw();
      drawingOpPool.add(op);
    }
    drawingOps.clear();
  }

  @Override
  protected void dispatchDraw(Canvas canvas) {
    super.dispatchDraw(canvas);

    // check the view removal is completed (by comparing the previous children count)
    if (drawingOps.size() < previousChildrenCount) {
      reverseLastTwoChildren = false;
    }
    previousChildrenCount = drawingOps.size();

    if (reverseLastTwoChildren && drawingOps.size() >= 2) {
      Collections.swap(drawingOps, drawingOps.size() - 1, drawingOps.size() - 2);
    }

    drawAndRelease();
  }

  @Override
  protected boolean drawChild(Canvas canvas, View child, long drawingTime) {
    drawingOps.add(obtainDrawingOp().set(canvas, child, drawingTime));
    return true;
  }

  private void performDraw(DrawingOp op) {
    super.drawChild(op.canvas, op.child, op.drawingTime);
  }

  private DrawingOp obtainDrawingOp() {
    if (drawingOpPool.isEmpty()) {
      return new DrawingOp();
    }
    return drawingOpPool.remove(drawingOpPool.size() - 1);
  }

  private final class DrawingOp {
    private Canvas canvas;
    private View child;
    private long drawingTime;

    DrawingOp set(Canvas canvas, View child, long drawingTime) {
      this.canvas = canvas;
      this.child = child;
      this.drawingTime = drawingTime;
      return this;
    }

    void draw() {
      performDraw(this);
      canvas = null;
      child = null;
      drawingTime = 0;
    }
  }
}
